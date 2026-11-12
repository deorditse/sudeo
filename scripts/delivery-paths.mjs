import path from "node:path";
import { realpath } from "node:fs/promises";

export const normalizeOutputAsset = (asset) => {
    if (typeof asset !== "string" || !asset) throw new Error("Delivery asset path must be a non-empty string");
    let decoded;
    try { decoded = decodeURIComponent(asset); }
    catch { throw new Error(`Delivery asset path is not valid URL encoding: ${asset}`); }
    if (decoded.includes("\\") || decoded.includes("?") || decoded.includes("#")) {
        throw new Error(`Delivery asset path contains unsupported characters: ${asset}`);
    }
    if (path.posix.isAbsolute(decoded) || /^[a-z][a-z\d+.-]*:/i.test(decoded) || decoded.split("/").includes("..")) {
        throw new Error(`Delivery asset path escapes output root: ${asset}`);
    }
    const normalized = path.posix.normalize(decoded);
    if (normalized === "." || normalized.startsWith("../")) throw new Error(`Delivery asset path escapes output root: ${asset}`);
    return normalized;
};

export const isJavaScriptAsset = (asset) => /\.(?:c|m)?js$/i.test(normalizeOutputAsset(asset));

export const validateManifestEntry = (manifest, entryKey) => {
    const entry = manifest?.[entryKey];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        throw new Error(`Manifest entry is missing or malformed: ${entryKey}`);
    }
    if (typeof entry.file !== "string" || !entry.file) {
        throw new Error(`Manifest entry file must be a non-empty string: ${entryKey}`);
    }
    normalizeOutputAsset(entry.file);
    for (const field of ["imports", "css"]) {
        if (!Object.prototype.hasOwnProperty.call(entry, field)) continue;
        if (!Array.isArray(entry[field])) throw new Error(`Manifest entry ${field} must be an array: ${entryKey}`);
        for (const value of entry[field]) {
            if (typeof value !== "string" || !value) throw new Error(`Manifest entry ${field} must contain non-empty strings: ${entryKey}`);
            if (field === "css") normalizeOutputAsset(value);
        }
    }
    return entry;
};

export const resolveOutputAsset = (outputRoot, asset) => {
    const normalized = normalizeOutputAsset(asset);
    const resolved = path.resolve(outputRoot, normalized);
    const relative = path.relative(path.resolve(outputRoot), resolved);
    if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
        throw new Error(`Delivery asset path escapes output root: ${asset}`);
    }
    return resolved;
};

export const resolveOutputAssetFile = async (outputRoot, asset) => {
    const lexicalTarget = resolveOutputAsset(outputRoot, asset);
    const [physicalRoot, physicalTarget] = await Promise.all([
        realpath(outputRoot),
        realpath(lexicalTarget),
    ]);
    const relative = path.relative(physicalRoot, physicalTarget);
    if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
        throw new Error(`Delivery asset physical target escapes output root: ${asset}`);
    }
    return physicalTarget;
};