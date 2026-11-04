
const statusCodesUtils = require('../utils/statusCodes.utils');
const reasonPhrasesUtils = require('../utils/reasonPhrases.utils');

class SuccessResponse {
    constructor(message, status, metadata) {
        this.message = message;
        this.status = status;
        this.timestamp = new Date().toISOString();
        this.metadata = metadata;
    }

    send(res) {
        return res.status(this.status).json(this);
    }
}

// 200 - OK
class Ok extends SuccessResponse {
    constructor({
        message = reasonPhrasesUtils.OK,
        status = statusCodesUtils.OK,
        metadata = {},
        options = {}
    } = {}) {
        super(message, status, metadata);
        this.options = options;
    }
}

// 201 - CREATED
class Created extends SuccessResponse {
    constructor({
        message = reasonPhrasesUtils.CREATED,
        status = statusCodesUtils.CREATED,
        metadata = {},
        options = {}
    } = {}) {
        super(message, status, metadata);
        this.options = options;
    }
}

// 202 - ACCEPTED
class Accepted extends SuccessResponse {
    constructor({
        message = reasonPhrasesUtils.ACCEPTED,
        status = statusCodesUtils.ACCEPTED,
        metadata = {},
        options = {}
    } = {}) {
        super(message, status, metadata);
        this.options = options;
    }
}

// 204 - NO CONTENT
class NoContent extends SuccessResponse {
    constructor({
        message = reasonPhrasesUtils.NO_CONTENT,
        status = statusCodesUtils.NO_CONTENT
    } = {}) {
        super(message, status, null);
    }

    send(res) {
        return res.status(this.status).end();
    }
}

module.exports = {
    SuccessResponse,
    Ok,
    Created,
    Accepted,
    NoContent
};
