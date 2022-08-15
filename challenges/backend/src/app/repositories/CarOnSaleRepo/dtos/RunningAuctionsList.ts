
export interface AuctionItem {
    id: number
    label: string
    minimumRequiredAsk: number
    currentHighestBidValue: number
    numBids: number
}

export interface RunningAuctionList {
    items: AuctionItem[]
    page: number
    total: number
}