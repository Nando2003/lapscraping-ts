import { load } from "cheerio";
import { getPageBody } from "../external/laptop-store";

export async function findLastPage() {
    const body = await getPageBody();
    const soup = load(body);
    const items = soup('a.page-link');

    let lastPage = 0;

    items.each((_, item) => {
        const text = soup(item).text().trim();
        const num = parseInt(text, 10);

        if (!isNaN(num) && num > lastPage) {
            lastPage = num;
        }
    });

    return lastPage;
}
