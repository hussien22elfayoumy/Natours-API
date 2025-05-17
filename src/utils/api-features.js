class APIFeatures {
  constructor(mongoQuery, queryString) {
    this.mongoQuery = mongoQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    /* 
		mongodb filtring
		Tour.find({difficulty: 'easy', duration: {$gte: 5}})
		the queryObj
		Tour.find({difficulty: 'easy', duration: {gte: 5}})
		so we gonna solve this problem
		*/

    // 1B) Adbanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongoQuery = this.mongoQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.replaceAll(',', ' ');
      this.mongoQuery = this.mongoQuery.sort(sortBy);

      // if you want decending use (-) before the field
      // to sort with multi falue in mongo  sort('price duration') in url sort=price,duration
    } else {
      this.mongoQuery = this.mongoQuery.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.replaceAll(',', ' ');
      this.mongoQuery = this.mongoQuery.select(fields);
    } else {
      this.mongoQuery = this.mongoQuery.select('-__v');
    }

    return this;
  }

  paginate() {
    const pageNo = +this.queryString.page || 1;
    const limitNo = +this.queryString.limit || 100;

    const skip = (pageNo - 1) * limitNo;

    this.mongoQuery = this.mongoQuery.skip(skip).limit(limitNo);

    return this;
  }
}

export default APIFeatures;
