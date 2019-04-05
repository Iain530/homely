const api = browser.topSites;

export default class TopSites {
    constructor(limit = 12) {
        this.topSites = null;
        this.limit = limit;
        this.initialised = this.init();
    }

    async init() {
        this.topSites = await api.get({
            includeFavicon: true,
            limit: this.limit,
        });
    }

    async getTopSites() {
        return this.topSites;
    }
}