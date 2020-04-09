module.exports = class FairiesRepository {
    constructor() {
        this.fairiesByIds = {};
    }

    upsertFairy(id, fairy) {
        fairy.id = id;
        this.fairiesByIds[id] = fairy;
    }

    deleteFairy(fairyId) {
        delete this.fairiesByIds[fairyId];
    }

    getFairy(fairyId) {
        return this.fairiesByIds[fairyId];
    }

    getFairiesByIds(fairiesIds) {
        const fairies = [];
        for (let id of fairiesIds) {
            if (this.fairiesByIds[id]) {
                fairies.push(this.fairiesByIds[id]);
            }
        }

        return fairies;
    }

    getAllFairies() {
        return Object.values(this.fairiesByIds);
    }
}