/**
 * 轮询方法封装
 */

class Loop {
  pollingWorker: any;
  /**
   * worker + requestAnimationFrame 实现定时器
   * @param callback
   * @param interval
   * @returns
   */
  customizeSetInterval(interval: number) {
    this.pollingWorker = this.createWorker(function (interval) {
      let timer = null;
      let startTime = Date.now();
      let loop = () => {
        let endTime = Date.now();
        if (endTime - startTime >= interval) {
          startTime = endTime = Date.now();
          // eslint-disable-next-line no-restricted-globals
          self.postMessage(timer);
        }
        timer = requestAnimationFrame(loop);
      };
      loop();
    }, interval);
    return this.pollingWorker;
  }
  /**
   * 销毁worker
   */
  customizeCancelInterval() {
    this.pollingWorker.terminate();
  }
  /**
   * 创建worker
   * @param f
   * @returns
   */
  createWorker(f, interval: number) {
    const blob = new Blob([`(${f.toString()})(${interval})`]);
    const url = window.URL.createObjectURL(blob);
    const worker = new Worker(url);
    return worker;
  }
}

export default Loop;
