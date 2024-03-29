import { IconifyIcon } from '@iconify/types';
import { IconifyJSON } from '@iconify/types';
import { IconifyTransformations } from '@iconify/types';

/**
 * Icon render modes
 *
 * 'bg' = SPAN with style using `background`
 * 'mask' = SPAN with style using `mask`
 * 'svg' = SVG
 */
declare type ActualRenderMode = 'bg' | 'mask' | 'svg';

export declare const addAPIProvider: (provider: string, customConfig: PartialIconifyAPIConfig) => boolean;

export declare const addCollection: (data: IconifyJSON, provider?: string) => boolean;

export declare const addIcon: (name: string, data: IconifyIcon) => boolean;

export declare const _api: IconifyAPIInternalFunctions;

/**
 * Set custom style to add to all components
 *
 * Affects only components rendered after function call
 */
export declare function appendCustomStyle(style: string): void;

declare type BrowserStorageType = 'local' | 'session';

export declare const buildIcon: (icon: IconifyIcon, customisations?: IconifyIconCustomisations) => IconifyIconBuildResult;

export declare const calculateSize: (size: string | number, ratio: number, precision?: number) => string | number;

export declare const disableCache: (storage: IconifyBrowserCacheType) => void;

export declare const enableCache: (storage: IconifyBrowserCacheType) => void;

/**
 * Signature for getAPIConfig
 */
export declare type GetAPIConfig = (provider: string) => IconifyAPIConfig | undefined;

export declare const getIcon: (name: string) => Required<IconifyIcon>;

export declare const iconExists: (name: string) => boolean;

/**
 * API config
 */
export declare interface IconifyAPIConfig extends RedundancyConfig {
    path: string;
    maxURL: number;
}

export declare interface IconifyAPICustomQueryParams {
    type: 'custom';
    provider?: string;
    uri: string;
}

/**
 * Iconify API functions
 */
export declare interface IconifyAPIFunctions {
    /**
     * Load icons
     */
    loadIcons: (icons: (IconifyIconName | string)[], callback?: IconifyIconLoaderCallback) => IconifyIconLoaderAbort;
    /**
     * Load one icon, using Promise syntax
     */
    loadIcon: (icon: IconifyIconName | string) => Promise<Required<IconifyIcon>>;
    /**
     * Add API provider
     */
    addAPIProvider: (provider: string, customConfig: PartialIconifyAPIConfig) => boolean;
}

/**
 * Params for sendQuery()
 */
declare interface IconifyAPIIconsQueryParams {
    type: 'icons';
    provider: string;
    prefix: string;
    icons: string[];
}

/**
 * Exposed internal functions
 *
 * Used by plug-ins, such as Icon Finder
 *
 * Important: any changes published in a release must be backwards compatible.
 */
export declare interface IconifyAPIInternalFunctions {
    /**
     * Get API config, used by custom modules
     */
    getAPIConfig: GetAPIConfig;
    /**
     * Set custom API module
     */
    setAPIModule: (provider: string, item: IconifyAPIModule) => void;
    /**
     * Send API query
     */
    sendAPIQuery: (target: string | PartialIconifyAPIConfig, query: IconifyAPIQueryParams, callback: QueryDoneCallback) => QueryAbortCallback;
    /**
     * Set and get fetch()
     */
    setFetch: (item: typeof fetch) => void;
    getFetch: () => typeof fetch | undefined;
    /**
     * List all API providers (from config)
     */
    listAPIProviders: () => string[];
}

/**
 * API modules
 */
export declare interface IconifyAPIModule {
    prepare: IconifyAPIPrepareIconsQuery;
    send: IconifyAPISendQuery;
}

/**
 * Functions to implement in module
 */
export declare type IconifyAPIPrepareIconsQuery = (provider: string, prefix: string, icons: string[]) => IconifyAPIIconsQueryParams[];

export declare type IconifyAPIQueryParams = IconifyAPIIconsQueryParams | IconifyAPICustomQueryParams;

export declare type IconifyAPISendQuery = (host: string, params: IconifyAPIQueryParams, callback: QueryModuleResponse) => void;

/**
 * Interface for exported functions
 */
export declare interface IconifyBrowserCacheFunctions {
    enableCache: (storage: IconifyBrowserCacheType) => void;
    disableCache: (storage: IconifyBrowserCacheType) => void;
}

/**
 * Cache types
 */
export declare type IconifyBrowserCacheType = BrowserStorageType | 'all';

/**
 * Interface for exported builder functions
 */
export declare interface IconifyBuilderFunctions {
    replaceIDs?: (body: string, prefix?: string | (() => string)) => string;
    calculateSize: (size: string | number, ratio: number, precision?: number) => string | number;
    buildIcon: (icon: IconifyIcon, customisations?: IconifyIconCustomisations) => IconifyIconBuildResult;
}

/**
 * Interface for exported functions
 */
declare interface IconifyExportedFunctions extends IconifyStorageFunctions, IconifyBuilderFunctions, IconifyBrowserCacheFunctions, IconifyAPIFunctions {
    _api: IconifyAPIInternalFunctions;
    appendCustomStyle: (value: string) => void;
    iconToHTML: (body: string, attributes: Record<string, string>) => string;
    svgToURL: (svg: string) => string;
}

export { IconifyIcon }

/**
 * Attributes as properties
 */
export declare interface IconifyIconAttributes extends Partial<Record<keyof Omit<IconifyIconProperties, 'icon' | 'mode'>, string>>, Partial<IconifyIconSVGAttributes> {
    icon: string;
    mode?: IconifyRenderMode;
}

/**
 * Interface for getSVGData() result
 */
export declare interface IconifyIconBuildResult {
    attributes: {
        width?: string;
        height?: string;
        viewBox: string;
    };
    viewBox: SVGViewBox;
    body: string;
}

/**
 * Create exported data: either component instance or functions
 */
export declare const IconifyIconComponent: IconifyExportedFunctions;

/**
 * Icon customisations
 */
declare type IconifyIconCustomisationProperties = {
    width?: string | number;
    height?: string | number;
    rotate?: string | number;
    flip?: string;
};

/**
 * Icon customisations
 */
export declare interface IconifyIconCustomisations extends IconifyTransformations, IconifyIconSizeCustomisations {
}

export declare interface IconifyIconHTMLElement extends PartialIconifyIconHTMLElement, IconifyExportedFunctions, Required<IconifyIconProperties> {
}

export declare interface IconifyIconHTMLElementClass extends IconifyExportedFunctions {
    new (): IconifyIconHTMLElement;
    prototype: IconifyIconHTMLElement;
}

/**
 * Function to abort loading (usually just removes callback because loading is already in progress)
 */
export declare type IconifyIconLoaderAbort = () => void;

/**
 * Loader callback
 *
 * Provides list of icons that have been loaded
 */
export declare type IconifyIconLoaderCallback = (loaded: IconifyIconName[], missing: IconifyIconName[], pending: IconifyIconName[], unsubscribe: IconifyIconLoaderAbort) => void;

/**
 * Icon name
 */
export declare interface IconifyIconName {
    readonly provider: string;
    readonly prefix: string;
    readonly name: string;
}

/**
 * All properties
 */
export declare interface IconifyIconProperties extends IconifyIconCustomisationProperties, Partial<IconifyIconSVGAttributes> {
    icon: string | IconifyIcon;
    mode?: IconifyRenderMode;
    inline?: boolean;
    observe?: boolean;
}

/**
 * Icon size
 */
export declare type IconifyIconSize = null | string | number;

/**
 * Dimensions
 */
declare interface IconifyIconSizeCustomisations {
    width?: IconifyIconSize;
    height?: IconifyIconSize;
}

/**
 * Icon status
 */
declare type IconifyIconStatus = 'rendered' | 'loading' | 'failed';

/**
 * SVG attributes that can be overwritten
 */
declare interface IconifyIconSVGAttributes {
    preserveAspectRatio: string;
}

export { IconifyJSON }

/**
 * Extra render modes
 *
 * 'style' = 'bg' or 'mask', depending on icon content
 */
export declare type IconifyRenderMode = 'style' | ActualRenderMode;

/**
 * Interface for exported storage functions
 */
export declare interface IconifyStorageFunctions {
    /**
     * Check if icon data is available
     */
    iconLoaded: (name: string) => boolean;
    /**
     * Older, badly named, version of iconLoaded()
     *
     * @deprecated
     */
    iconExists: (name: string) => boolean;
    /**
     * Get icon data with all properties
     */
    getIcon: (name: string) => Required<IconifyIcon> | null;
    /**
     * List all available icons
     */
    listIcons: (provider?: string, prefix?: string) => string[];
    /**
     * Add icon to storage
     */
    addIcon: (name: string, data: IconifyIcon) => boolean;
    /**
     * Add icon set to storage
     */
    addCollection: (data: IconifyJSON, provider?: string) => boolean;
}

export declare const iconLoaded: (name: string) => boolean;

export declare const iconToHTML: (body: string, attributes: Record<string, string>) => string;

export declare const listIcons: (provider?: string, prefix?: string) => string[];

export declare const loadIcon: (icon: string | IconifyIconName) => Promise<Required<IconifyIcon>>;

export declare const loadIcons: (icons: (string | IconifyIconName)[], callback?: IconifyIconLoaderCallback) => IconifyIconLoaderAbort;

export declare type PartialIconifyAPIConfig = Partial<IconifyAPIConfig> & Pick<IconifyAPIConfig, 'resources'>;

/**
 * Interface
 */
declare interface PartialIconifyIconHTMLElement extends HTMLElement {
    restartAnimation: () => void;
    get status(): IconifyIconStatus;
}

/**
 * Callback for "abort" pending item.
 */
declare type QueryAbortCallback = () => void;

/**
 * Callback
 *
 * If error is present, something went wrong and data is undefined. If error is undefined, data is set.
 */
declare type QueryDoneCallback = (data?: QueryModuleResponseData, error?: QueryModuleResponseData) => void;

declare type QueryModuleResponse = (status: QueryModuleResponseType, data: QueryModuleResponseData) => void;

/**
 * Response from query module
 */
declare type QueryModuleResponseData = unknown;

/**
 * Response from query module
 */
declare type QueryModuleResponseType = 'success' | 'next' | 'abort';

/**
 * Configuration object
 */
declare interface RedundancyConfig {
    resources: RedundancyResource[];
    index: number;
    timeout: number;
    rotate: number;
    random: boolean;
    dataAfterTimeout: boolean;
}

/**
 * Resource to rotate (usually hostname or partial URL)
 */
declare type RedundancyResource = string;

export declare const svgToURL: (svg: string) => string;

/**
 * SVG viewBox: x, y, width, height
 */
declare type SVGViewBox = [x: number, y: number, width: number, height: number];

export { }

/**
 * Add custom element to global elements list
 */
declare global {
	interface HTMLElementTagNameMap {
		'iconify-icon': IconifyIconHTMLElement;
	}
}
