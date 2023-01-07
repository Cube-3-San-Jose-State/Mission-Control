class Queue{
	constructor(length){
		this.length = length;
		this.arr = []
	}

	enqueue(data){
		if(this.arr.length >= this.length){
			this.arr.shift();
		};
		this.arr.push(data);
	}

	getArray(){
		return this.arr;
	}
}

export default Queue;