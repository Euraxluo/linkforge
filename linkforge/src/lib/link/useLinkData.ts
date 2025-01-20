import {useState, useEffect, useCallback} from 'react'
import {getOwnedObjects} from "@/lib/client"
import {useCurrentAccount} from "@mysten/dapp-kit"
import {useNetworkVariable} from "@/config/networkConfig";

export interface LinkData {
    objectId: string
    display: {
        name: string
        creator: string
        image_url: string
        link: string
        identify: string
    }
}

export function useLinkData() {
    const [linkData, setLinkData] = useState<LinkData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const currentAccount = useCurrentAccount()
    const linkforgePackageId = useNetworkVariable("linkforgePackageId")

    const fetchLinkData = useCallback(async () => {
        if (!currentAccount?.address || loading) return

        setLoading(true)
        setError(null)

        try {
            const {result} = await getOwnedObjects({
                owner: currentAccount.address,
                limit: 1,
                structType: `${linkforgePackageId}::link::Link`,
                matchType: 'MatchAll',
                showDisplay: true,
            })

            if (result.length > 0 && result[0]?.data?.objectId && result[0]?.data?.display?.data) {
                setLinkData({
                    objectId: result[0].data.objectId,
                    display: result[0].data.display.data as LinkData['display']
                })
            } else {
                setLinkData(null)
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'))
        } finally {
            setLoading(false)
        }
    }, [currentAccount?.address, linkforgePackageId])

    useEffect(() => {
        if (currentAccount?.address) {
            fetchLinkData()
        }
    }, [currentAccount?.address, fetchLinkData])

    return {linkData, loading, error, refetch: fetchLinkData}
}