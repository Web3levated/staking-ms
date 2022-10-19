import { BlockWithTransactions } from "@ethersproject/abstract-provider";
import { BigNumber, BigNumberish, ethers, providers } from "ethers";
import { Deferrable } from "ethers/lib/utils";

export class MockProvider extends providers.Provider{

    public transactionResponse: providers.TransactionResponse;
    public transactionReceipt: providers.TransactionReceipt;

    spyData: Deferrable<providers.TransactionRequest>[];
    stubResponses: string[]; // encoded stub responses

    constructor() {
        super();
        this.spyData = [];
        this.stubResponses = [];
    }

    async getSpyData(): Promise<providers.TransactionRequest[]> {
        let resolved = this.spyData.map(async (spyData) => await ethers.utils.resolveProperties(spyData));
        let result: providers.TransactionRequest[] = await Promise.all(resolved);
        return result;
    }

    setStubResponses(stubResponses: string[]) {
        this.stubResponses = stubResponses;
    }

    reset(){
        this.stubResponses = [];
        this.spyData = [];
    }

    getNetwork(): Promise<providers.Network> {
        throw new Error("Method not implemented.");
    }
    getBlockNumber(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getGasPrice(): Promise<BigNumber> {
        throw new Error("Method not implemented.");
    }
    getBalance(addressOrName: string | Promise<string>, blockTag?: providers.BlockTag | Promise<providers.BlockTag>): Promise<BigNumber> {
        throw new Error("Method not implemented.");
    }
    getTransactionCount(addressOrName: string | Promise<string>, blockTag?: providers.BlockTag | Promise<providers.BlockTag>): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getCode(addressOrName: string | Promise<string>, blockTag?: providers.BlockTag | Promise<providers.BlockTag>): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getStorageAt(addressOrName: string | Promise<string>, position: BigNumberish | Promise<BigNumberish>, blockTag?: providers.BlockTag | Promise<providers.BlockTag>): Promise<string> {
        throw new Error("Method not implemented.");
    }
    sendTransaction(signedTransaction: string | Promise<string>): Promise<providers.TransactionResponse> {
        throw new Error("Method not implemented.");
    }
    call(transaction: Deferrable<providers.TransactionRequest>, blockTag?: providers.BlockTag | Promise<providers.BlockTag>): Promise<string> {
        if(this.stubResponses.length == 0){
            throw new Error("MockProvider: Stub Responses is empty");
        }
        this.spyData.push(transaction);
        return Promise.resolve(this.stubResponses.shift());
    }
    estimateGas(transaction: Deferrable<providers.TransactionRequest>): Promise<BigNumber> {
        throw new Error("Method not implemented.");
    }
    getBlock(blockHashOrBlockTag: providers.BlockTag | Promise<providers.BlockTag>): Promise<providers.Block> {
        throw new Error("Method not implemented.");
    }
    getBlockWithTransactions(blockHashOrBlockTag: providers.BlockTag | Promise<providers.BlockTag>): Promise<BlockWithTransactions> {
        throw new Error("Method not implemented.");
    }
    getTransaction(transactionHash: string): Promise<providers.TransactionResponse> {
        if(this.transactionResponse === undefined){
            throw new Error("ProviderMock: Transaction Receipt not set")
        } else {
            return Promise.resolve(this.transactionResponse);
        }
    }
    getTransactionReceipt(transactionHash: string): Promise<providers.TransactionReceipt> {
        throw new Error("Method not implemented.");
    }
    getLogs(filter: providers.Filter): Promise<providers.Log[]> {
        throw new Error("Method not implemented.");
    }
    async resolveName(name: string | Promise<string>): Promise<string> {
        if(!ethers.utils.isAddress(await name)){
            throw new Error("ProviderMock: ENS resolution not supported")
        }
        return Promise.resolve(name);
    }
    lookupAddress(address: string | Promise<string>): Promise<string> {
        throw new Error("Method not implemented.");
    }
    on(eventName: providers.EventType, listener: providers.Listener): providers.Provider {
        throw new Error("Method not implemented.");
    }
    once(eventName: providers.EventType, listener: providers.Listener): providers.Provider {
        throw new Error("Method not implemented.");
    }
    emit(eventName: providers.EventType, ...args: any[]): boolean {
        throw new Error("Method not implemented.");
    }
    listenerCount(eventName?: providers.EventType): number {
        throw new Error("Method not implemented.");
    }
    listeners(eventName?: providers.EventType): providers.Listener[] {
        throw new Error("Method not implemented.");
    }
    off(eventName: providers.EventType, listener?: providers.Listener): providers.Provider {
        throw new Error("Method not implemented.");
    }
    removeAllListeners(eventName?: providers.EventType): providers.Provider {
        throw new Error("Method not implemented.");
    }
    waitForTransaction(transactionHash: string, confirmations?: number, timeout?: number): Promise<providers.TransactionReceipt> {
        throw new Error("Method not implemented.");
    }



}