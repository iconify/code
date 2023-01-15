
/**
 * Params for sendQuery()
 */
declare interface APIQueryParams {
    provider: string;
    prefix: string;
    icons: string[];
}

/**
 * Get SVG data
 */
declare function buildIcon(name: string, customisations: IconifyIconCustomisations): IconifyIconBuildResult | null;

/**
 * Function to send to item on completion
 */
declare interface DoneCallback {
    (data: unknown, payload: unknown, getStatus: GetQueryStatus): void;
}

/**
 * Execution status
 */
declare type ExecStatus = 'pending' | 'completed' | 'aborted';

/**
 * Function to filter item
 */
declare interface FilterCallback {
    (item: GetQueryStatus): boolean;
}

/**
 * Signature for getAPIConfig
 */
export declare type GetAPIConfig = (provider: string) => IconifyAPIConfig | undefined;

/**
 * Callback to track status
 */
declare type GetQueryStatus = () => QueryStatus;

/**
 * Global variable
 */
declare const Iconify: IconifyGlobal;
export default Iconify;

/**
 * Alias.
 */
declare interface IconifyAlias extends IconifyOptional {
	// Parent icon index without prefix, required.
	parent: string;

	// IconifyOptional properties.
	// Alias should have only properties that it overrides.
	// Transformations are merged, not overridden. See IconifyTransformations comments.
}

/**
 * "aliases" field of JSON file.
 */
declare interface IconifyAliases {
	// Index is name of icon, without prefix. Value is IconifyAlias object.
	[index: string]: IconifyAlias;
}

/**
 * Iconify interface
 */
export declare interface IconifyAPI {
    /**
     * Toggle local and session storage
     */
    enableCache: (storage: IconifyCacheType, value: boolean) => void;
    /**
     * Load icons
     */
    loadIcons: (icons: (IconifyIconName | string)[], callback?: IconifyIconLoaderCallback) => IconifyIconLoaderAbort;
    /**
     * Add API provider
     */
    addAPIProvider: (provider: string, customConfig: Partial<IconifyAPIConfig>) => void;
}

/**
 * API config
 */
export declare interface IconifyAPIConfig extends RedundancyConfig {
    path: string;
    maxURL: number;
}

export declare interface IconifyAPIInternalStorage {
    config: IconifyAPIConfig;
    redundancy: Redundancy;
}

/**
 * API modules
 */
export declare interface IconifyAPIModule {
    prepare: IconifyAPIPrepareQuery;
    send: IconifyAPISendQuery;
}

/**
 * Functions to implement in module
 */
export declare type IconifyAPIPrepareQuery = (provider: string, prefix: string, icons: string[]) => APIQueryParams[];

export declare type IconifyAPISendQuery = (host: string, params: APIQueryParams, status: PendingItem) => void;

/**
 * Cache types
 */
export declare type IconifyCacheType = 'local' | 'session' | 'all';

/**
 * Icon categories
 */
declare interface IconifyCategories {
	// Index is category title, such as "Weather".
	// Value is array of icons that belong to that category.
	// Each icon can belong to multiple categories or no categories.
	[index: string]: string[];
}

/**
 * Characters used in font.
 */
declare interface IconifyChars {
	// Index is character, such as "f000".
	// Value is icon name.
	[index: string]: string;
}

/**
 * Icon dimensions.
 *
 * Used in:
 *  icon (as is)
 *  alias (overwrite icon's properties)
 *  root of JSON file (default values)
 */
declare interface IconifyDimenisons {
	// Left position of viewBox.
	// Defaults to 0.
	left?: number;

	// Top position of viewBox.
	// Defaults to 0.
	top?: number;

	// Width of viewBox.
	// Defaults to 16.
	width?: number;

	// Height of viewBox.
	// Defaults to 16.
	height?: number;
}

/**
 * Exposed internal functions
 *
 * Used by plug-ins, such as Icon Finder
 *
 * Important: any changes published in a release must be backwards compatible.
 */
declare interface IconifyExposedAPIInternals {
    /**
     * Get internal API data, used by Icon Finder
     */
    getAPI: (provider: string) => IconifyAPIInternalStorage | undefined;
    /**
     * Get API config, used by custom modules
     */
    getAPIConfig: GetAPIConfig;
    /**
     * Set API module
     */
    setAPIModule: (provider: string, item: IconifyAPIModule) => void;
}

/**
 * Exposed internal functions
 *
 * Used by plug-ins, such as Icon Finder
 *
 * Important: any changes published in a release must be backwards compatible.
 */
declare interface IconifyExposedCommonInternals {
    /**
     * Calculate width knowing height and width/height ratio (or vice versa)
     */
    calculateSize: (size: IconifyIconSize, ratio: number, precision?: number) => IconifyIconSize;
}

/**
 * Exposed internal functions
 *
 * Used by plug-ins, such as Icon Finder
 *
 * Important: any changes published in a release must be backwards compatible.
 */
export declare interface IconifyExposedInternals extends IconifyExposedAPIInternals, IconifyExposedCommonInternals {
}

/**
 * Iconify interface
 */
declare interface IconifyGlobal extends IconifyGlobal_2, IconifyGlobal2 {
}
export { IconifyGlobal }
export { IconifyGlobal as IconifyGlobalCommon }

/**
 * Exported functions
 */
export declare interface IconifyGlobal2 extends IconifyAPI {
    /**
     * Expose internal functions
     */
    _internal: IconifyExposedInternals;
}

/**
 * Iconify interface
 */
declare interface IconifyGlobal_2 {
    /**
     * Get version
     */
    getVersion: () => string;
    /**
     * Check if icon exists
     */
    iconExists: (name: string) => boolean;
    /**
     * Get icon data with all properties
     */
    getIcon: (name: string) => IconifyIcon | null;
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
    /**
     * Render icons
     */
    renderSVG: (name: string, customisations: IconifyIconCustomisations) => SVGElement | null;
    renderHTML: (name: string, customisations: IconifyIconCustomisations) => string | null;
    /**
     * Get icon data
     */
    renderIcon: typeof buildIcon;
    /**
     * Replace IDs in icon body, should be used when parsing buildIcon() result
     */
    replaceIDs: typeof replaceIDs;
    /**
     * Scan DOM
     */
    scanDOM: typeof scanDOM;
    /**
     * Set root node
     */
    setRoot: (root: HTMLElement) => void;
    /**
     * Pause observer
     */
    pauseObserver: typeof pauseObserver;
    /**
     * Resume observer
     */
    resumeObserver: typeof resumeObserver;
}

/**
 * Icon alignment
 */
export declare type IconifyHorizontalIconAlignment = 'left' | 'center' | 'right';

/**
 * Icon.
 */
export declare interface IconifyIcon extends IconifyOptional {
	// Icon body: <path d="..." />, required.
	body: string;

	// IconifyOptional properties.
	// If property is missing in JSON file, look in root object for default value.
}

/**
 * Interface for getSVGData() result
 */
export declare interface IconifyIconBuildResult {
    attributes: {
        width: string;
        height: string;
        preserveAspectRatio: string;
        viewBox: string;
    };
    body: string;
    inline?: boolean;
}

/**
 * Icon customisations
 */
export declare interface IconifyIconCustomisations {
    inline?: boolean;
    width?: IconifyIconSize;
    height?: IconifyIconSize;
    hAlign?: IconifyHorizontalIconAlignment;
    vAlign?: IconifyVerticalIconAlignment;
    slice?: boolean;
    hFlip?: boolean;
    vFlip?: boolean;
    rotate?: number;
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
 * "icons" field of JSON file.
 */
declare interface IconifyIcons {
	// Index is name of icon, without prefix. Value is IconifyIcon object.
	[index: string]: IconifyIcon;
}

/**
 * Icon size
 */
export declare type IconifyIconSize = null | string | number;

/**
 * Icon set information block.
 */
declare interface IconifyInfo {
	// Icon set name.
	name: string;

	// Total number of icons.
	total?: number;

	// Version string.
	version?: string;

	// Author information.
	author: {
		// Author name.
		name: string;

		// Link to author's website or icon set website.
		url?: string;
	};

	// License
	license: {
		// Human readable license.
		title: string;

		// SPDX license identifier.
		spdx?: string;

		// License URL.
		url?: string;
	};

	// Array of icons that should be used for samples in icons list.
	samples: string[];

	// Icon grid: number or array of numbers.
	height?: number | number[];

	// Display height for samples: 16 - 24
	displayHeight?: number;

	// Category on Iconify collections list.
	category?: string;

	// Palette status. True if icons have predefined color scheme, false if icons use currentColor.
	// Icon set should not mix icons with and without palette to simplify search.
	palette: boolean;
}

/**
 * JSON structure.
 *
 * All optional values can exist in root of JSON file, used as defaults.
 */
export declare interface IconifyJSON extends IconifyOptional, IconifyMetaData {
	// Prefix for icons in JSON file, required.
	prefix: string;

	// API provider, optional.
	provider?: string;

	// List of icons, required.
	icons: IconifyIcons;

	// Optional aliases.
	aliases?: IconifyAliases;

	// Optional list of missing icons. Returned by Iconify API when querying for icons that do not exist.
	not_found?: string[];

	// IconifyOptional properties that are used as default values for icons when icon is missing value.
	// If property exists in both icon and root, use value from icon.
	// This is used to reduce duplication.
}

/**
 * Meta data stored in JSON file, used for browsing icon set.
 */
declare interface IconifyMetaData {
	// Icon set information block. Used for public icon sets, can be skipped for private icon sets.
	info?: IconifyInfo;

	// Characters used in font. Used for searching by character for icon sets imported from font, exporting icon set to font.
	chars?: IconifyChars;

	// Categories. Used for filtering icons.
	categories?: IconifyCategories;

	// Optional themes.
	themes?: IconifyThemes;
}

/**
 * Combination of dimensions and transformations.
 */
declare interface IconifyOptional
	extends IconifyDimenisons,
		IconifyTransformations {}

/**
 * Optional themes.
 */
declare interface IconifyThemes {
	// Key is unique string.
	[index: string]: {
		// Theme title.
		title: string;

		// Icon prefix or suffix, including dash. All icons that start with prefix and end with suffix belong to theme.
		prefix?: string; // Example: 'baseline-'
		suffix?: string; // Example: '-filled'
	};
}

/**
 * Icon transformations.
 *
 * Used in:
 *  icon (as is)
 *  alias (merged with icon's properties)
 *  root of JSON file (default values)
 */
declare interface IconifyTransformations {
	// Number of 90 degrees rotations.
	// 0 = 0, 1 = 90deg and so on.
	// Defaults to 0.
	// When merged (such as alias + icon), result is icon.rotation + alias.rotation.
	rotate?: number;

	// Horizontal flip.
	// Defaults to false.
	// When merged, result is icon.hFlip !== alias.hFlip
	hFlip?: boolean;

	// Vertical flip. (see hFlip comments)
	vFlip?: boolean;
}

export declare type IconifyVerticalIconAlignment = 'top' | 'middle' | 'bottom';

/**
 * Callback for "limit" configuration property.
 *
 * Function should return number (at least "retries" + 1), 0 to abort (different from default value 0 that means no limit)
 */
declare interface LimitCallback {
    (retry: number, // Retry counter, starts with 1 for first callback
    startTime: number): number;
}

declare type OptionalDoneCallback = DoneCallback | null;

/**
 * Pause observer
 */
declare function pauseObserver(): void;

/**
 * Item in pending items list
 */
declare interface PendingItem {
    readonly getStatus: GetQueryStatus;
    status: ExecStatus;
    readonly attempt: number;
    readonly done: QueryDoneCallback;
    abort: QueryAbortCallback | null;
}

/**
 * Callback for "abort" pending item.
 */
declare interface QueryAbortCallback {
    (): void;
}

/**
 * Function to send to item to send query
 */
declare interface QueryCallback {
    (resource: unknown, payload: unknown, status: PendingItem): void;
}

/**
 * Callback for "done" pending item.
 */
declare interface QueryDoneCallback {
    (data?: unknown): void;
}

/**
 * Status for query
 */
declare interface QueryStatus {
    done: (data: unknown) => void;
    abort: () => void;
    subscribe: (callback: OptionalDoneCallback, overwrite?: boolean) => void;
    payload: unknown;
    startTime: number;
    loop: number;
    attempt: number;
    startIndex: number;
    index: number;
    maxIndex: number;
    status: ExecStatus;
}

/**
 * Redundancy instance
 */
declare interface Redundancy {
    query: (payload: unknown, queryCallback: QueryCallback, doneCallback?: OptionalDoneCallback) => GetQueryStatus;
    find: (callback: FilterCallback) => GetQueryStatus | null;
    setIndex: (index: number) => void;
    getIndex: () => number;
    cleanup: () => void;
}

/**
 * Configuration object
 */
declare interface RedundancyConfig {
    resources: Array<any>;
    index: number;
    timeout: number | TimeoutCallback;
    rotate: number | RotationTimeoutCallback;
    random: boolean;
    limit: number | LimitCallback;
}

/**
 * Replace IDs in SVG output with unique IDs
 * Fast replacement without parsing XML, assuming commonly used patterns and clean XML (icon should have been cleaned up with Iconify Tools or SVGO).
 */
declare function replaceIDs(body: string, prefix?: string | (() => string)): string;

/**
 * Resume observer
 */
declare function resumeObserver(): void;

/**
 * Callback for "rotate" configuration property.
 * "rotate" is used for timeout when switching to next resource within same loop.
 *
 * Function should return number in milliseconds, 0 to abort
 */
declare interface RotationTimeoutCallback {
    (queriesSent: number, // Number of queries sent so far, starts with 0 for first callback
    retry: number, // Retry counter, starts with 1 for first callback
    nextIndex: number, // Resource index for next query
    startTime: number): number;
}

/**
 * Scan DOM for placeholders
 */
declare function scanDOM(root?: HTMLElement): void;

/**
 * Callback for "timeout" configuration property.
 * "timeout" is used for timeout when all resources have been queried and loop must start again
 *
 * Function should return number in milliseconds, 0 to abort
 */
declare interface TimeoutCallback {
    (retries: number, // Number of retries so far
    nextIndex: number, // Resource index for next query
    startTime: number): number;
}

export { }
