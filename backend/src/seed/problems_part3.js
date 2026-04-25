const problems3 = [
  {
    title: "Two Sum (Indices)",
    difficulty: "medium",
    description: `Given an array of size n and a target value, find two indices such that their values add up to the target.

You must return the indices (0-based). It is guaranteed that exactly one solution exists.

Input Format:
First line: n
Second line: array elements
Third line: target

Output Format:
Print two indices separated by space.

Example:
Input:
4
2 7 11 15
9

Output:
0 1`,
    sampleInput: "4\n2 7 11 15\n9",
    sampleOutput: "0 1",
    testCases: [
      { input: "4\n2 7 11 15\n9", output: "0 1", isHidden: false },
      { input: "3\n3 2 4\n6", output: "1 2", isHidden: false },
      { input: "2\n3 3\n6", output: "0 1", isHidden: true },
    ],
  },

  {
    title: "Move Zeroes",
    difficulty: "medium",
    description: `Move all zeros in the array to the end while maintaining the relative order of non-zero elements.

Input Format:
n
array

Output Format:
Modified array

Example:
Input:
5
0 1 0 3 12

Output:
1 3 12 0 0`,
    sampleInput: "5\n0 1 0 3 12",
    sampleOutput: "1 3 12 0 0",
    testCases: [
      { input: "5\n0 1 0 3 12", output: "1 3 12 0 0", isHidden: false },
      { input: "3\n0 0 1", output: "1 0 0", isHidden: false },
      { input: "1\n0", output: "0", isHidden: true },
    ],
  },

  {
    title: "Container With Most Water",
    difficulty: "hard",
    description: `Given n heights, find two lines that together with x-axis form a container that holds the most water.

Input Format:
n
heights array

Output Format:
Maximum area

Example:
Input:
9
1 8 6 2 5 4 8 3 7

Output:
49`,
    sampleInput: "9\n1 8 6 2 5 4 8 3 7",
    sampleOutput: "49",
    testCases: [
      { input: "9\n1 8 6 2 5 4 8 3 7", output: "49", isHidden: false },
      { input: "2\n1 1", output: "1", isHidden: false },
      { input: "5\n1 2 3 4 5", output: "6", isHidden: true },
    ],
  },

  {
    title: "Longest Consecutive Sequence",
    difficulty: "hard",
    description: `Find the length of the longest consecutive elements sequence.

Input Format:
n
array

Output Format:
Length of longest sequence

Example:
Input:
6
100 4 200 1 3 2

Output:
4`,
    sampleInput: "6\n100 4 200 1 3 2",
    sampleOutput: "4",
    testCases: [
      { input: "6\n100 4 200 1 3 2", output: "4", isHidden: false },
      { input: "5\n1 2 0 1 3", output: "4", isHidden: false },
      { input: "1\n10", output: "1", isHidden: true },
    ],
  },

  {
    title: "Product of Array Except Self",
    difficulty: "hard",
    description: `Return an array such that output[i] is the product of all elements except itself.

No division allowed.

Input Format:
n
array

Output Format:
Result array

Example:
Input:
4
1 2 3 4

Output:
24 12 8 6`,
    sampleInput: "4\n1 2 3 4",
    sampleOutput: "24 12 8 6",
    testCases: [
      { input: "4\n1 2 3 4", output: "24 12 8 6", isHidden: false },
      { input: "5\n-1 1 0 -3 3", output: "0 0 9 0 0", isHidden: false },
      { input: "2\n2 3", output: "3 2", isHidden: true },
    ],
  },

  {
    title: "Subarray Sum Equals K",
    difficulty: "medium",
    description: `Count the number of subarrays whose sum equals k.

Input Format:
n
array
k

Output Format:
Count

Example:
Input:
5
1 1 1 2 2
3

Output:
3`,
    sampleInput: "5\n1 1 1 2 2\n3",
    sampleOutput: "3",
    testCases: [
      { input: "5\n1 1 1 2 2\n3", output: "3", isHidden: false },
      { input: "3\n1 2 3\n3", output: "2", isHidden: false },
      { input: "1\n1\n1", output: "1", isHidden: true },
    ],
  },

  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    description: `Find the length of the longest substring without repeating characters.

Input Format:
string s

Output Format:
Length

Example:
Input:
abcabcbb

Output:
3`,
    sampleInput: "abcabcbb",
    sampleOutput: "3",
    testCases: [
      { input: "abcabcbb", output: "3", isHidden: false },
      { input: "bbbbb", output: "1", isHidden: false },
      { input: "pwwkew", output: "3", isHidden: true },
    ],
  },

  {
    title: "Minimum Window Substring Length",
    difficulty: "hard",
    description: `Given string s and t, find the length of the smallest substring of s that contains all characters of t.

Input Format:
string s
string t

Output Format:
Length of minimum window

Example:
Input:
ADOBECODEBANC
ABC

Output:
4`,
    sampleInput: "ADOBECODEBANC\nABC",
    sampleOutput: "4",
    testCases: [
      { input: "ADOBECODEBANC\nABC", output: "4", isHidden: false },
      { input: "a\na", output: "1", isHidden: false },
      { input: "a\nb", output: "0", isHidden: true },
    ],
  },

  {
    title: "Trapping Rain Water",
    difficulty: "hard",
    description: `Given elevation map, compute how much water it can trap.

Input Format:
n
array

Output Format:
Total water

Example:
Input:
12
0 1 0 2 1 0 1 3 2 1 2 1

Output:
6`,
    sampleInput: "12\n0 1 0 2 1 0 1 3 2 1 2 1",
    sampleOutput: "6",
    testCases: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", output: "6", isHidden: false },
      { input: "3\n3 0 2", output: "2", isHidden: false },
      { input: "1\n1", output: "0", isHidden: true },
    ],
  },

  {
    title: "Majority Element",
    difficulty: "medium",
    description: `Find the element that appears more than n/2 times.

Input Format:
n
array

Output Format:
Majority element

Example:
Input:
5
2 2 1 1 2

Output:
2`,
    sampleInput: "5\n2 2 1 1 2",
    sampleOutput: "2",
    testCases: [
      { input: "5\n2 2 1 1 2", output: "2", isHidden: false },
      { input: "3\n3 3 4", output: "3", isHidden: false },
      { input: "1\n1", output: "1", isHidden: true },
    ],
  },
];

module.exports = problems3;