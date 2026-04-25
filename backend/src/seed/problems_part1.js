const problems1 = [
  {
    title: "Maximum Element",
    difficulty: "easy",
    description: `You are given an array of integers of size n. Your task is to find and print the maximum element present in the array.

Input Format:
The first line contains an integer n — the number of elements.
The second line contains n space-separated integers.

Output Format:
Print a single integer — the maximum element in the array.

Constraints:
1 ≤ n ≤ 10^5
-10^9 ≤ arr[i] ≤ 10^9

Example:
Input:
5
1 2 3 4 5

Output:
5`,
    sampleInput: "5\n1 2 3 4 5",
    sampleOutput: "5",
    testCases: [
      { input: "5\n1 2 3 4 5", output: "5", isHidden: false },
      { input: "4\n10 9 8 7", output: "10", isHidden: false },
      { input: "3\n-1 -2 -3", output: "-1", isHidden: true },
    ],
  },

  {
    title: "Minimum Element",
    difficulty: "easy",
    description: `Given an array of integers of size n, find and print the minimum element.

Input Format:
First line contains n.
Second line contains n space-separated integers.

Output Format:
Print the minimum element.

Constraints:
1 ≤ n ≤ 10^5

Example:
Input:
5
1 2 3 4 5

Output:
1`,
    sampleInput: "5\n1 2 3 4 5",
    sampleOutput: "1",
    testCases: [
      { input: "5\n1 2 3 4 5", output: "1", isHidden: false },
      { input: "4\n10 9 8 7", output: "7", isHidden: false },
      { input: "3\n-1 -2 -3", output: "-3", isHidden: true },
    ],
  },

  {
    title: "Sum of Array",
    difficulty: "easy",
    description: `You are given an array of size n. Find the sum of all elements in the array.

Input Format:
First line contains n.
Second line contains n integers.

Output Format:
Print a single integer — sum of all elements.

Constraints:
1 ≤ n ≤ 10^5

Example:
Input:
4
1 2 3 4

Output:
10`,
    sampleInput: "4\n1 2 3 4",
    sampleOutput: "10",
    testCases: [
      { input: "4\n1 2 3 4", output: "10", isHidden: false },
      { input: "3\n10 20 30", output: "60", isHidden: false },
      { input: "1\n5", output: "5", isHidden: true },
    ],
  },

  {
    title: "Count Even Numbers",
    difficulty: "easy",
    description: `Given an array of integers, count how many numbers are even.

Input Format:
First line contains n.
Second line contains n integers.

Output Format:
Print the count of even numbers.

Example:
Input:
5
1 2 3 4 5

Output:
2`,
    sampleInput: "5\n1 2 3 4 5",
    sampleOutput: "2",
    testCases: [
      { input: "5\n1 2 3 4 5", output: "2", isHidden: false },
      { input: "4\n2 4 6 8", output: "4", isHidden: false },
      { input: "3\n1 3 5", output: "0", isHidden: true },
    ],
  },

  {
    title: "Reverse Array",
    difficulty: "easy",
    description: `Given an array of size n, print the elements in reverse order.

Input Format:
First line contains n.
Second line contains n integers.

Output Format:
Print the reversed array.

Example:
Input:
4
1 2 3 4

Output:
4 3 2 1`,
    sampleInput: "4\n1 2 3 4",
    sampleOutput: "4 3 2 1",
    testCases: [
      { input: "4\n1 2 3 4", output: "4 3 2 1", isHidden: false },
      { input: "2\n5 6", output: "6 5", isHidden: false },
      { input: "1\n10", output: "10", isHidden: true },
    ],
  },

  {
    title: "Second Largest Element",
    difficulty: "easy",
    description: `Find the second largest distinct element in the array.

Input Format:
First line contains n.
Second line contains n integers.

Output Format:
Print the second largest element.

Example:
Input:
5
1 2 3 4 5

Output:
4`,
    sampleInput: "5\n1 2 3 4 5",
    sampleOutput: "4",
    testCases: [
      { input: "5\n1 2 3 4 5", output: "4", isHidden: false },
      { input: "4\n10 10 9 8", output: "9", isHidden: false },
      { input: "2\n5 3", output: "3", isHidden: true },
    ],
  },

  {
    title: "Check Sorted Array",
    difficulty: "easy",
    description: `Check whether the given array is sorted in non-decreasing order.

Input Format:
First line contains n.
Second line contains n integers.

Output Format:
Print "true" if sorted, otherwise "false".

Example:
Input:
5
1 2 3 4 5

Output:
true`,
    sampleInput: "5\n1 2 3 4 5",
    sampleOutput: "true",
    testCases: [
      { input: "5\n1 2 3 4 5", output: "true", isHidden: false },
      { input: "4\n5 3 2 1", output: "false", isHidden: false },
      { input: "1\n10", output: "true", isHidden: true },
    ],
  },

  {
    title: "Linear Search",
    difficulty: "easy",
    description: `Given an array and a target value, determine whether the target exists in the array.

Input Format:
First line contains n.
Second line contains n integers.
Third line contains target value.

Output Format:
Print "true" if found, otherwise "false".

Example:
Input:
5
1 2 3 4 5
3

Output:
true`,
    sampleInput: "5\n1 2 3 4 5\n3",
    sampleOutput: "true",
    testCases: [
      { input: "5\n1 2 3 4 5\n3", output: "true", isHidden: false },
      { input: "4\n1 2 3 4\n6", output: "false", isHidden: false },
      { input: "1\n10\n10", output: "true", isHidden: true },
    ],
  },

  {
    title: "Count Frequency",
    difficulty: "easy",
    description: `Given an array and a number x, count how many times x appears in the array.

Input Format:
First line contains n.
Second line contains n integers.
Third line contains x.

Output Format:
Print the frequency of x.

Example:
Input:
5
1 2 2 3 2
2

Output:
3`,
    sampleInput: "5\n1 2 2 3 2\n2",
    sampleOutput: "3",
    testCases: [
      { input: "5\n1 2 2 3 2\n2", output: "3", isHidden: false },
      { input: "4\n1 1 1 1\n1", output: "4", isHidden: false },
      { input: "3\n1 2 3\n4", output: "0", isHidden: true },
    ],
  },

  {
    title: "Maximum Subarray Sum",
    difficulty: "medium",
    description: `Find the maximum sum of a contiguous subarray using Kadane’s Algorithm.

Input Format:
First line contains n.
Second line contains n integers.

Output Format:
Print the maximum subarray sum.

Example:
Input:
9
-2 1 -3 4 -1 2 1 -5 4

Output:
6`,
    sampleInput: "9\n-2 1 -3 4 -1 2 1 -5 4",
    sampleOutput: "6",
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6", isHidden: false },
      { input: "1\n1", output: "1", isHidden: false },
      { input: "5\n5 4 -1 7 8", output: "23", isHidden: true },
    ],
  },
];

module.exports = problems1;