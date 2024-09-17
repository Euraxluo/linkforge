import {SuiObjectDataFilter, SuiClient} from '@mysten/sui/client'
import {SuinsClient} from '@mysten/suins';
import {NETWORK, networkConfig} from "./networkConfig";

export const client = new SuiClient(networkConfig[NETWORK])

export const suinsClient = new SuinsClient({
    client,
    network: NETWORK,
});


// Now you can use it to create a SuiNS client.

export type FilterMatchType = 'MatchAll' | 'MatchAny' | 'MatchNone';

export interface GetOwnedObjectsParams {
    owner: string;
    cursor?: string | null | undefined;
    limit?: number | null | undefined;
    module?: string;
    packageId?: string;
    structType?: string;
    matchType?: FilterMatchType;
    showContent?: boolean;
    showDisplay?: boolean;
    showOwner?: boolean;
    showPreviousTransaction?: boolean;
    showStorageRebate?: boolean;
    showType?: boolean;
}


export const getOwnedObjects = async ({
                                          owner,
                                          cursor,
                                          limit,
                                          module,
                                          packageId,
                                          structType,
                                          matchType = 'MatchAll',
                                          showType = false,
                                          showContent = false,
                                          showDisplay = false,
                                          showOwner = false,
                                          showPreviousTransaction = false,
                                          showStorageRebate = false
                                      }: GetOwnedObjectsParams) => {
    let result: any[] = [];
    let nextCursor = cursor;

    // 构建过滤器
    let filter: SuiObjectDataFilter | null = null;
    const constructedFilters: SuiObjectDataFilter[] = [];

    if (module && packageId) {
        constructedFilters.push({MoveModule: {module, package: packageId}});
    }
    if (packageId) {
        constructedFilters.push({Package: packageId});
    }
    if (structType) {
        constructedFilters.push({StructType: structType});
    }

    if (constructedFilters.length > 0) {
        if (matchType === 'MatchAll') {
            filter = {MatchAll: constructedFilters};
        } else if (matchType === 'MatchAny') {
            filter = {MatchAny: constructedFilters};
        } else if (matchType === 'MatchNone') {
            filter = {MatchNone: constructedFilters};
        }
    }

    const data = await client.getOwnedObjects({
        owner,
        cursor: nextCursor,
        limit: limit,
        filter: filter || null,
        options: {
            showContent,
            showDisplay,
            showOwner,
            showPreviousTransaction,
            showStorageRebate,
            showType,
        },
    });

    nextCursor = data.nextCursor ?? null;
    result = data.data;
    const hasNextPage = data.hasNextPage;
    return {result, nextCursor, hasNextPage};
};


export interface GetObjectParams {
    id: string;
    /**
     * Whether to show the content(i.e., package content or Move struct content) of the object. Default to
     * be False
     */
    showContent?: boolean;
    /** Whether to show the Display metadata of the object for frontend rendering. Default to be False */
    showDisplay?: boolean;
    /** Whether to show the owner of the object. Default to be False */
    showOwner?: boolean;
    /** Whether to show the previous transaction digest of the object. Default to be False */
    showPreviousTransaction?: boolean;
    /** Whether to show the storage rebate of the object. Default to be False */
    showStorageRebate?: boolean;
    /** Whether to show the type of the object. Default to be False */
    showType?: boolean;
}

export const getObjectDetail = async ({
                                          id,
                                          showType = false,
                                          showContent = false,
                                          showDisplay = false,
                                          showOwner = false,
                                          showPreviousTransaction = false,
                                          showStorageRebate = false
                                      }: GetObjectParams) => {
    try {
        let result = await client.getObject({
            id,
            options: {
                showContent,
                showDisplay,
                showOwner,
                showPreviousTransaction,
                showStorageRebate,
                showType,
            },
        });
        if (result && result.data) {
            return result.data;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        console.error("Error fetching object detail:", error);
        throw error;
    }
};
export const getNameRecord = async (name: string) => {
    const nameRecord = await suinsClient.getNameRecord(name);
    console.log(nameRecord);
    return nameRecord;
}

