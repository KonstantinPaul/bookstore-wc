// valid isbn for first book (title: "Ahren: Der 13. Paladin Band I")
const isbn = "3866801929";

/*
 * Invalid cases expect that Errors are thrown:
 *   - TypeError is thrown for missing params or rating is not a number
 *   - RangeError is thrown for invalid ranges,
 *     because rating has to be: 1 <= rating <= 5
 *   - Error is currently thrown, if ISBN is valid, but not found!
 */
const invalidRatingUseCases = [{
    description: "Update with no params",
    type: "invalid",
    data: {
      isbn: undefined,
      rating: undefined
    },
    expectedError: {
      error: TypeError,
      expectedMessage: "isbn or rating are missing"
    }
  },
  {
    description: "Update with negativ rating",
    type: "invalid",
    data: {
      isbn,
      rating: -4,
    },
    expectedError: {
      error: RangeError,
      expectedMessage: undefined
    }
  },
  {
    description: "Update with rating exceeding the upper bound, e. g. rating > 5",
    type: "invalid",
    data: {
      isbn,
      rating: 8,
    },
    expectedError: {
      error: RangeError,
      expectedMessage: undefined
    }
  },
  {
    description: "Update with rating is NaN (not a number)",
    type: "invalid",
    data: {
      isbn,
      rating: "not a number",
    },
    expectedError: {
      error: TypeError,
      expectedMessage: "rating is not a number"
    }
  },
  {
    description: "Update with valid, but not found isbn",
    type: "invalid",
    data: {
      isbn: "1234567890", // not a mocked ISBN, but syntactically valid one
      rating: 1,
    },
    expectedError: {
      error: Error, // Error is thrown, when ISBN is valid but not found
      expectedMessage: undefined
    }
  },
];

export { invalidRatingUseCases, isbn as validISBN };
