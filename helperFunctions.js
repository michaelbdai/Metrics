var Metric = function (name) {
  this.name = name;
  this.sum = 0;
  this.content = {};
  this.autoGeneratedKey = - 1;

  this.minHalfHeap = new BinaryHeapIndex(function (child, parent) {
    return child >= parent;
  }, this.content);
  this.maxHalfHeap = new BinaryHeapIndex(function (child, parent) {
    return child <= parent;
  }, this.content);
  this.minHeap = new BinaryHeapIndex(function (child, parent) {
    return child >= parent;
  }, this.content);
  this.maxHeap = new BinaryHeapIndex(function (child, parent) {
    return child <= parent;
  }, this.content);
};

Metric.prototype = {
  insert: function (element) {
    this.autoGeneratedKey ++;
    this.content[this.autoGeneratedKey] = element;
    this.maxHeap.push(this.autoGeneratedKey);
    this.minHeap.push(this.autoGeneratedKey);
    this.sum += element.value;
    if (this.size() % 2 === 0) {
      this.maxHalfHeap.push(this.autoGeneratedKey);
      if (!this.minHalfHeap.content.length) {
        return;
      }
      if (this.maxHalfHeap.content[0] > this.minHalfHeap.content[0]) {
        var toMax = this.minHalfHeap.pop();
        var toMin = this.maxHalfHeap.pop();
        this.minHalfHeap.push(toMin);
        this.maxHalfHeap.push(toMax);
      }
    } else {
      this.maxHalfHeap.push(this.autoGeneratedKey);
      var toMin = this.maxHalfHeap.pop();
      this.minHalfHeap.push(toMin);
    }
  },
  median: function () {
    if (this.size() % 2 === 0) {
      return (this.content[this.minHalfHeap.content[0]].value +
        this.content[this.maxHalfHeap.content[0]].value) / 2.0;
    } else {
      return this.content[this.maxHalfHeap.content[0]].value;
    }

  },
  size: function () {
    return this.autoGeneratedKey + 1;
  },
  average: function() {
    return this.sum / (this.autoGeneratedKey + 1); 
  },
  min: function() {
    return this.content[this.minHeap.content[0]].value
  },
  max: function() {
    return this.content[this.maxHeap.content[0]].value;
  },


};

function BinaryHeapIndex (compareFunction, referenceContent) {
  this.content = [];
  this.compareFunction = compareFunction;
  this.referenceContent = referenceContent;
}

BinaryHeapIndex.prototype = {
  push: function (element) {
    this.content.push(element);
    this.bubbleUp(this.content.length - 1);
  },
  pop: function () {
    var result = this.content[0];
    var end = this.content.pop();
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  },
  size: function () {
    return this.content.length;
  },
  bubbleUp: function (n) {
    var element = this.content[n];
    var parent;
    while (n > 0) {
      var parentN = Math.floor((n + 1) / 2) - 1;
      parent = this.content[parentN];
      if (this.compareFunction(this.referenceContent[element].value, this.referenceContent[parent].value)) {
        break;
      }
      this.content[parentN] = element;
      this.content[n] = parent;
      n = parentN;
    }
  },
  sinkDown: function (n) {
    var length = this.content.length;
    var element = this.content[n];
    while (true) {
      var child2n = (n + 1) * 2, child1n = child2n - 1;
      var swap = null;
      if (child1n < length) {
        var child1 = this.content[child1n];
        if (!this.compareFunction(this.referenceContent[child1].value, this.referenceContent[element].value)) {
          swap = child1n;
        }
      }
      if (child2n < length) {
        var child2 = this.content[child2n];
        if (!this.compareFunction(this.referenceContent[child2].value, (swap === null ? this.referenceContent[element].value : this.referenceContent[child1].value))) {
          swap = child2n;
        }
      }
      if (swap === null) {
        break;
      }
      this.content[n] = this.content[swap];
      this.content[swap] = element;
      n = swap;
    }
  }
};

module.exports.Metric = Metric;
module.exports.BinaryHeapIndex = BinaryHeapIndex;