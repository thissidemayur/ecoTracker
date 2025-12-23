import sanitize from "sanitize-html"
/**
 * @description- recursively santize input, primiarily strpping HTML tags and trimming stirngs
 * @param {*} input - the input to be sanitized
 * @returns {*} - sanitized input
 */
const cleanValue = (input) => {
    if( input === null || input === undefined) return input

    // if it is string
    if(typeof input === "string") {
        const sanitizedString = sanitize(input,{
            allowedTags:[],
            allowedAttributes: {}
        })
        return sanitizedString.trim()
    }

    // if it is array
    if (Array.isArray(input)) {
        return input.map(cleanValue) //same as, input.map((item) => cleanValue(item))
    }

    // if it is object (or nested object) 
    if (typeof input ==="object") {
        const cleanedObject = {}

        for (const key in input) {
            if (Object.hasOwnProperty.call(input,key)) {
                cleanedObject[key] = cleanValue(input[key])
            }
        }
        return cleanedObject
    }

    // for other types (number, boolean, etc), return as is
    return input
}

/**
 * @description Express middleware to sanitize all input sources: body, query, and params.
 * This prevents XSS and HTML injection regardless of how the data enters the API.
 */
export const sanitizedBodyMiddleware = (req,res,next) => {
    const targets = ["body", "query", "params"]

    targets.forEach((target)=>{
        if (req[target] && typeof req[target] === "object") {
            if (target === "body") {
req[target] = cleanValue(req[target]);
console.log(`Sanitized ${target}:`, req[target]);
            }else {
                const cleanedData = cleanValue(req[target]);
                // delete old key to ensure a fresh start
                Object.keys(req[target]).forEach(key=>delete req[target][key])
                // assign cleaned data (add new keys back into req[target])
                Object.assign(req[target], cleanedData);
                console.log(`Sanitized ${target}:`, req[target]);
            }

        }
    })
    next()

}
