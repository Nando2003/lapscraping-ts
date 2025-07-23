import { Router, Request, Response } from 'express';
import { scraping } from '../services/scraping-service';
import { redisClient } from '../external/redis-connection';
import { Laptop } from '../models/laptop-models';

const router = Router();

type SortBy = 'price' | 'name';

interface LaptopQuery {
  searchByTitle?: string;
  reverse?: string;
  sortBy?: SortBy;
}

/**
 * @openapi
 * /api/laptops:
 *   get:
 *     summary: Lista laptops, com filtro por título e ordenação
 *     tags:
 *       - Laptops
 *     parameters:
 *       - in: query
 *         name: searchByTitle
 *         schema:
 *           type: string
 *         description: Texto a buscar no nome do laptop
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, name]
 *         description: Ordena por preço ou por nome
 *       - in: query
 *         name: reverse
 *         schema:
 *           type: boolean
 *         description: Inverte a ordem dos resultados se true
 *     responses:
 *       '200':
 *         description: Lista de laptops filtrados e ordenados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   basePrice:
 *                     type: number
 */
router.get(
  '/laptops',
  async (req: Request<{}, {}, {}, LaptopQuery>, res: Response) => {
    const searchByName = (req.query.searchByTitle as string) ?? '';
    const sortBy = (req.query.sortBy as SortBy) ?? 'price';
    const reverse = (req.query.reverse as string)?.toLowerCase() === 'true';

    const cacheKey = `laptops:${searchByName}:${sortBy}:${reverse}`;
    const cached = await redisClient.get(cacheKey);
    
    const laptops: Laptop[] = cached ? JSON.parse(cached) : await scraping();

    const filteredLaptops = laptops.filter(laptop =>
      laptop.name.toLowerCase().includes(searchByName.toLowerCase())
    );

    if (sortBy === 'price') {
      filteredLaptops.sort((a, b) => a.basePrice - b.basePrice);
    } else {
      filteredLaptops.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (reverse) {
      filteredLaptops.reverse();
    }

    res.json(filteredLaptops);
  }
);

export { router as laptopRouter };
