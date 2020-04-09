module.exports = class FairiesRepository {
    constructor() {
        this.fairiesByIds = {};
    }

    upsertFairy(fairy) {
        this.fairiesByIds[fairy.id] = fairy;
    }

    deleteFairy(fairyId) {
        delete this.fairiesByIds[fairyId];
    }

    getFairy(fairyId) {
        return this.fairiesByIds[fairyId];
    }

    getFairiesByIds(fairiesIds) {
        const fairies = [];
        for(let id of faireisIds) {
            fairies.push(this.fairiesByIds[id]);
        }

        return fairies;
    }

    getAllFairies() {
        return Object.values(this.fairiesByIds);
    }
}