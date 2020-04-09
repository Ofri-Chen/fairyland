const FairyError = require('./fairy-error');

module.exports = class FairiesController {
    fairyProps = ['name', 'spells', 'subFairies'];

    constructor(fairiesRepository) {
        this.fairiesRepository = fairiesRepository;
    }

    createFairy(id, fairy) {
        if (this.fairiesRepository.getFairy(id) != null) {
            throw new FairyError('Fairy already exists', 409);
        }

        this.upsertFairy(id, fairy);
    }

    updateFairy(id, fairy) {
        if (this.fairiesRepository.getFairy(id) == null) {
            throw new FairyError(`Fairy doesn't exist`, 404);
        }

        this.upsertFairy(id, fairy);
    }

    deleteFairy(id) {
        const existingFairy = this.fairiesRepository.getFairy(id);
        if (existingFairy == null) {
            throw new FairyError(`Fairy doesn't exist`, 404);
        }

        this.fairiesRepository.deleteFairy(id);
    }

    upsertFairy(id, fairy) {
        this.validateFairyProps(id, fairy);
        this.validateSubFairies(id, fairy.subFairies);
        this.validateSpells(fairy.spells);
        this.fairiesRepository.upsertFairy(id, fairy);
    }

    getFairy(id) {
        const fairy = this.fairiesRepository.getFairy(id);
        if (fairy == null) {
            throw new FairyError(`fairy doesn't exist`, 404);
        }

        return fairy;
    }

    getFairiesByIds(fairiesIds) {
        return this.fairiesRepository.getFairiesByIds(fairiesIds);
    }

    getAllFairies() {
        return this.fairiesRepository.getAllFairies();
    }

    validateFairyProps(id, fairy) {
        if (fairy == null) {
            throw new FairyError('Fairy not provided', 400);
        }
        const missingProps = [];
        this.fairyProps.forEach(prop => {
            if (fairy[prop] == null) {
                missingProps.push(prop);
            }
        });
        if (missingProps.length > 0) {
            throw new FairyError(`fairy is missing props: ${JSON.stringify(missingProps)}`, 400);
        }

        this.validateFairyPropsValues(id, fairy);
    }

    validateFairyPropsValues(id, fairy) {
        if (fairy.id != null && fairy.id !== id) {
            throw new FairyError(`id can't be updated !`, 400);
        }

        if (typeof fairy.name !== 'string') {
            throw new FairyError(`fairy name has to be a string`, 400);
        }

        if (!Array.isArray(fairy.spells)) {
            throw new FairyError(`fairy spells has to be an array`, 400);
        }

        if (!Array.isArray(fairy.subFairies)) {
            throw new FairyError(`fairy subFairies has to be an array`, 400);
        }
    }

    validateSubFairies(id, subFairies) {
        if (this.fairiesRepository.getFairiesByIds(subFairies).length < subFairies.length) {
            throw new FairyError(`not all the subfairies exist`, 400);
        }

        this.validateNotCircular(subFairies, [id]);
    }

    validateNotCircular(fairyIds, parentChain = []) {
        const subFairies = this.fairiesRepository.getFairiesByIds(fairyIds);

        subFairies.forEach(fairy => {
            if (parentChain.includes(fairy.id)) {
                throw new FairyError(`circular subfairy !, parentChain: ${JSON.stringify(parentChain)}`, 400);
            }

            this.validateNotCircular(fairy.subFairies, [...parentChain, fairy.id]);
        });
    }

    validateSpells(spells) {
        const checkedSet = new Set();
        const dupesSet = new Set();

        spells.forEach(spell => {
            if (checkedSet.has(spell)) {
                dupesSet.add(spell);
            } else {
                checkedSet.add(spell);
            }
        });

        if (dupesSet.size > 0) {
            throw new FairyError(`duplicated spells are not allowed (${new Array(dupesSet)})`, 409);
        }
    }
}