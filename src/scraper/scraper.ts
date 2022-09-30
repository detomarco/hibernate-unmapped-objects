import { log } from '../utils/log.utils';
import { AnnotationScraper, ClassPropertyScraper, JavaClassScraper } from './scraper.model';
import { getFileContentSanitized } from './sanitizer';
import { matchGroupMultiple, matchGroups } from '../utils/regex.util';
import { removeUndefinedItems } from '../utils/array.utils';
import { MapString } from "../model/model";

const classFieldRegex = new RegExp('(?:@[\\w =,"()@ .]+)? private \\w+ \\w+;', 'g');
const captureFieldAnnotationRegex = new RegExp('(@\\w+(?:\\([ \\w=.,")]+)?)', 'g');
const captureAnnotationNameAndAttribute = new RegExp('@(\\w+)(?:\\(([ \\w=.,"]+)\\))?');
const captureAnnotationAttributesItems = new RegExp('((?:([\\w ])+=)?[\\w." ]+)', 'g');

const capturePropertyNameAndAnnotations = new RegExp('(@[\\w =,"()@ .]+)?private \\w+ (\\w+);');
const captureClassNameAndAnnotations = new RegExp('(@[\\w =,"()@ .]+)?public class (\\w+)');
const captureNameAndValueAttribute = new RegExp('(?:([\\w ]+)=)?(?:[ "]+)?([\\w .]+)"?');

const getClassInfo = (contentSanitized: string): { name: string | undefined, annotations: AnnotationScraper[] } => {
    const match = matchGroups(contentSanitized, captureClassNameAndAnnotations);
    const annotations = getAnnotations(match?.first);
    return { name: match?.second, annotations };
};

const getAnnotationAttributes = (attributesStringOptional: string | undefined): MapString => {
    if (attributesStringOptional == undefined) return {};
    try {
        const attributes = matchGroupMultiple(attributesStringOptional, captureAnnotationAttributesItems);

        return removeUndefinedItems(
            attributes.map(it => {
                const match =  matchGroups(it, captureNameAndValueAttribute);

                return match;
            })
        ).reduce((agg, match): MapString => {
            const cc = match.first ?? 'default';
            agg[cc] = match.second;
            return agg;
        }, {} as MapString) || {};
    } catch (e) {
        log.error('Unable to parse annotation attributes for', attributesStringOptional, e);
        return {};
    }
};

const getAnnotation = (annotation: string): AnnotationScraper | undefined => {
    try {
        const match = matchGroups(annotation, captureAnnotationNameAndAttribute)!;
        const attributes = getAnnotationAttributes(match.second);

        return { name: match.first!, attributes };
    } catch (e) {
        log.error('Unable to parse annotation for', annotation, e);
        return undefined;
    }
};

const getAnnotations = (annotationString: string | undefined): AnnotationScraper[] => {
    if (annotationString === undefined) {
        return [];
    }

    try {
        const annotationsName = matchGroupMultiple(annotationString, captureFieldAnnotationRegex);
        log.trace('annotations name', annotationsName);

        const annotationsOpt = annotationsName.map(annotation => getAnnotation(annotation)) || [];
        return removeUndefinedItems(annotationsOpt);
    } catch (e) {
        log.error('Unable to parse annotations for', annotationString, e);
        return [];
    }
};

const getProperty = (property: string): ClassPropertyScraper | undefined => {
    try {
        const annotationsName = matchGroupMultiple(property, captureFieldAnnotationRegex);

        const match = matchGroups(property, capturePropertyNameAndAnnotations)!;
        log.trace('annotations name', annotationsName);

        const annotations = getAnnotations(match.first);

        return { property: match.second, annotations };
    } catch (e) {
        log.error('Unable to property for', property, e);
        return undefined;
    }
};
const getProperties = (content: string): ClassPropertyScraper[] => {
    try {
        const propertiesString = matchGroupMultiple(content, classFieldRegex);
        const propertiesOpt = propertiesString.map(property => getProperty(property));
        return removeUndefinedItems(propertiesOpt);
    } catch (e) {
        log.error('Unable to parse properties for', content, e);
        return [];
    }
};

export const scrapeJavaClass = (javaFilePath: string, content: string): JavaClassScraper | undefined => {
    try {
        const contentSanitized = getFileContentSanitized(content);
        log.trace(`content file sanitized ${javaFilePath}`, contentSanitized);

        const properties = getProperties(contentSanitized);
        log.trace(`properties ${javaFilePath}`, properties);

        const { name, annotations } = getClassInfo(contentSanitized);
        return {
            filePath: javaFilePath,
            name,
            annotations,
            properties
        };
    } catch (e) {
        log.error('Unable to parse java class for', javaFilePath, e);
        return undefined;
    }
};
