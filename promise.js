class DevPromise {
    constructor(executor) {
        if (typeof executor !== "function") {
            throw new Error("Executor must be a function")
        }
        this.status = "Pending";
        this.value = undefined;

        this.all = [];
        this.chain = [];
        this.onCatch = undefined;
        this.onFinaly = undefined;

        this.then = function(callback) {
            this.chain.push(callback);
            return this;
        }

        this.catch = function(callback) {
            this.onCatch = callback;
            return this;
        }

        this.finally = function(callback) {
            this.onFinaly = callback;
            return this;
        }

        executor(resolve.bind(this), reject.bind(this));

        function resolve(value) {
            this.status = 'resolved';
            this.value = value;
            this.chain.forEach(func => {
                func(this.value);
            }, this);

            if (typeof this.finallyCallback === "function") {
                this.finallyCallback(this.value);
            }

            return value;

        }

        function reject(value) {
            this.status = 'rejected';
            this.value = value;

            if (typeof this.catchCallback === "function") {
                this.catchCallback(this.value);
            }

            if (typeof this.finallyCallback === "function") {
                this.finallyCallback(this.value);
            }

            if (this.status == 'resolved') {
                throw new Error("This is resolved state")
            }
            return this;
        }
    }

    static resolve(value) {
        if (value instanceof DevPromise) {
            return new this((resolve) => {
                resolve(value);
            });
        }

        // if (this !== DevPromise)  {
        //     throw new Error("Bla");
        // }

        return new this(function(resolve, reject) {
            if (typeof resolve !== 'function' || typeof reject !== 'function') {
                throw new TypeError('Not a function');
            }
            resolve(value);
        });
    }

    static reject(value) {
        if (value instanceof DevPromise) {
            return value;
        }
        return new this(function(resolve, reject) {
            if (typeof resolve !== 'function' || typeof reject !== 'function') {
                throw new TypeError('Not a function');
            }
            return reject(value);
        });
    }

    static all(promises) {
        if (promises.length === 0) {
            console.log("this", this)
            return new this((resolve, reject) => {
                resolve([]);
            });
        }
        return new this((resolve, reject) => {
            const results = [];
            const count = 0;
            promises.forEach((promise, i) => {
                this.resolve(promise).then(res => {
                        results.push(res);
                        count += 1;

                        if (count === promises.length) {
                            resolve(results);
                        }
                    },
                    error => {
                        reject(error);
                    }
                )
            })
        })
    }
}
module.exports = DevPromise;




//     this.chain = [];
//     this.hendleError = () => {};

//     this.state = "Pending";
//     this.resolve = this.resolve.bind.this;
//     this.reject = this.reject.bind.this;

//     executor(this.resolve, this.reject);
// }

// then(resolve) {
//     this.chain.push(resolve);
//     return;
// }

// catch (hendleError) {
//     this.hendleError = hendleError;
//     return;
