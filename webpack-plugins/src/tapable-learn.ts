import { SyncHook, AsyncParallelHook } from 'tapable';

class OrderImpl {
  hooks: {
    goods: SyncHook<Array<string | number>>;
    consumer: AsyncParallelHook<Array<string | number>>;
  };

  constructor() {
    this.hooks = {
      goods: new SyncHook(['goodsId', 'count']),
      consumer: new AsyncParallelHook(['orderId']),
    };
  }

  queryGoods(goodsId: string, count: number) {
    console.log('start queryGoods', goodsId);
    this.hooks.goods.call(goodsId, count);
  }

  queryConsumer(orderId: string) {
    return this.hooks.consumer.promise(orderId);
  }
}

const order = new OrderImpl();

order.hooks.goods.tap('goods plugin', (goodsId, count) => {
  console.log('goods plugin finished , goodsId:', goodsId, count);
});

order.hooks.consumer.tapPromise('pay plugin 1', async (orderId) => {
  console.log('pay plugin 1 finished , orderid:', orderId);
});
order.hooks.consumer.tapPromise('pay plugin 2', async (orderId) => {
  console.log('pay plugin 2 finished , orderid:', orderId);
});
order.hooks.consumer.tapPromise('pay plugin 3', async (orderId) => {
  console.log('pay plugin 3 finished , orderid:', orderId);
});
order.hooks.consumer.tapPromise('pay plugin 4', async (orderId) => {
  console.log('pay plugin 4 finished , orderid:', orderId);
});

order.queryGoods('goodsid-1', 1);
order.queryGoods('goodsid-2', 2);

order.queryConsumer('orderid-1');
order.queryConsumer('orderid-2');
