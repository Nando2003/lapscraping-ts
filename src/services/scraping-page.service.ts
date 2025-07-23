import { load } from "cheerio";
import { Laptop, LaptopReview } from "../models/laptop-models";
import { getPageBody } from "../external/laptop-store";
import { BASE_URL } from "../config/settings";
import urlJoin from "url-join";


export async function scrapingPage(page: number): Promise<Laptop[]>{
    console.log(`Scraping page ${page}...`);
    const body = await getPageBody(`?page=${page}`);
    const soup = load(body);
    const laptops = soup('.card-body');

    const laptopList: Laptop[] = [];

    laptops.each((_, item) => {
        const name = soup(item).find('a.title').attr('title') || '';
        const description = soup(item).find('p.description').text().trim();

        const rawPrice = soup(item).find('h4.price').text().trim();
        const cleanedPrice = rawPrice.replace(/[^\d.]/g, ''); 
        const price = parseFloat(cleanedPrice) || 0;

        const imageSrc = soup(item).find('.card-img-top').attr('src') || '';
        const baseUrl = new URL(BASE_URL).origin;
        const imageUrl = urlJoin(baseUrl, imageSrc);

        const ratingAttr = soup(item).find('p[data-rating]').attr('data-rating') ?? '0';
        const ratingNum = parseInt(ratingAttr);

        const reviewsCount = soup(item).find('.review-count').text().trim() ?? '0';
        const cleanedReviewsCount = reviewsCount.replace(/[^\d]/g, '');
        const reviewsCountNum = parseInt(cleanedReviewsCount);

        let reviews: LaptopReview = {
            stars: ratingNum,
            amountReviews: reviewsCountNum
        }

        let laptop: Laptop = {
            name: name,
            description: description,
            basePrice: price,
            imageUrl: imageUrl,
            reviews: reviews
        }

        laptopList.push(laptop);
    });

    return laptopList;
}