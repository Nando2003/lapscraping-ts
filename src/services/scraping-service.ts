import { Laptop } from "../models/laptop-models";
import { findLastPage } from "./find-last-page-service";
import { scrapingPage } from "./scraping-page.service";


export async function scraping(): Promise<Laptop[]> {
    let laptops: Laptop[] = [];
    const lastPage = await findLastPage();

    const promises: Promise<Laptop[]>[] = [];
    for (let page = 1; page <= lastPage; page++) {
        promises.push(scrapingPage(page));
    }

    const results = await Promise.all(promises);
    const allLaptops = results.flat();
    return allLaptops;
}