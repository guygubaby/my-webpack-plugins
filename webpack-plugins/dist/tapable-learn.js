"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tapable_1 = require("tapable");
class OrderImpl {
    constructor() {
        this.hooks = {
            goods: new tapable_1.SyncHook(['goodsId', 'count']),
            consumer: new tapable_1.AsyncParallelHook(['orderId']),
        };
    }
    queryGoods(goodsId, count) {
        console.log('start queryGoods', goodsId);
        this.hooks.goods.call(goodsId, count);
    }
    queryConsumer(orderId) {
        return this.hooks.consumer.promise(orderId);
    }
}
const order = new OrderImpl();
order.hooks.goods.tap('goods plugin', (goodsId, count) => {
    console.log('goods plugin finished , goodsId:', goodsId, count);
});
order.hooks.consumer.tapPromise('pay plugin 1', (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('pay plugin 1 finished , orderid:', orderId);
}));
order.hooks.consumer.tapPromise('pay plugin 2', (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('pay plugin 2 finished , orderid:', orderId);
}));
order.hooks.consumer.tapPromise('pay plugin 3', (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('pay plugin 3 finished , orderid:', orderId);
}));
order.hooks.consumer.tapPromise('pay plugin 4', (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('pay plugin 4 finished , orderid:', orderId);
}));
order.queryGoods('goodsid-1', 1);
order.queryGoods('goodsid-2', 2);
order.queryConsumer('orderid-1');
order.queryConsumer('orderid-2');
