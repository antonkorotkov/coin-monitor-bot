declare type MarketData = {
    Label: string;
    Name: string;
    Price: number;
    Volume_24h: number;
    Timestamp: number;
};

declare type MarketCollectionOptions = {
    onMarketsChange?: (markets: import('./Market')[]) => void
};