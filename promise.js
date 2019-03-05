class DevPromise {
    constructor(executor) {
        if (typeof executor !== "function") {
            throw new Error("Executor must be a function")
        }
        this.status = "Pending";
        this.value = undefined;

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

        this.finaly = function(callback) {
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

            if (typeof this.finalyCallback === "function") {
                this.finalyCallback(this.value);
            }
        }

        function reject(value) {
            this.status = 'rejected';
            this.value = value;

            if (typeof this.catchCallback === "function") {
                this.catchCallback(this.value);
            }

            if (typeof this.finalyCallback === "function") {
                this.finalyCallback(this.value);
            }

            if (this.status == 'resolved') {
                throw new Error("This is is resolved state")
            }

            return this;
        }

        function resolve(value) {
            this.status = 'resolved';
            this.value = value;
            this.chain.forEach(func => {
                func(this.value);
            }, this);

            if (typeof this.finalyCallback === "function") {
                this.finalyCallback(this.value);
            }
        }
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