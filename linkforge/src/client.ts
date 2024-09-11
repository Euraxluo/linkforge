import {SuiObjectDataFilter, SuiClient} from '@mysten/sui/client'
import {NETWORK, networkConfig} from "./networkConfig";

export const client = new SuiClient(networkConfig[NETWORK])

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