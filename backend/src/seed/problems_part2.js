const problems2 = [
  {
    title: "Palindrome String",
    difficulty: "easy",
    description: `Given a string, check whether it is a palindrome.

A string is called a palindrome if it reads the same forward and backward.

Input Format:
A single string s.

Output Format:
Print "true" if palindrome, otherwise "false".

Constraints:
1 ≤ length of s ≤ 10^5

Example:
Input:
madam

Output:
true`,
    sampleInput: "madam",
    sampleOutput: "true",
    testCases: [
      { input: "madam", output: "true", isHidden: false },
      { input: "hello", output: "false", isHidden: false },
      { input: "a", output: "true", isHidden: true },
    ],
  },

  {
    title: "Reverse String",
    difficulty: "easy",
    description: `Given a string, print the reversed string.

Input Format:
A single string s.

Output Format:
Print the reversed string.

Example:
Input:
hello

Output:
olleh`,
    sampleInput: "hello",
    sampleOutput: "olleh",
    testCases: [
      { input: "hello", output: "olleh", isHidden: false },
      { input: "abc", output: "cba", isHidden: false },
      { input: "a", output: "a", isHidden: true },
    ],
  },

  {
    title: "Count Vowels",
    difficulty: "easy",
    description: `Given a string, count the number of vowels (a, e, i, o, u).

Input Format:
A string s.

Output Format:
Print the count of vowels.

Example:
Input:
hello

Output:
2`,
    sampleInput: "hello",
    sampleOutput: "2",
    testCases: [
      { input: "hello", output: "2", isHidden: false },
      { input: "aeiou", output: "5", isHidden: false },
      { input: "xyz", output: "0", isHidden: true },
    ],
  },

  {
    title: "Check Anagram",
    difficulty: "easy",
    description: `Given two strings, check if they are anagrams.

Two strings are anagrams if they contain the same characters with same frequency.

Input Format:
First line: string s1
Second line: string s2

Output Format:
Print "true" or "false".

Example:
Input:
listen
silent

Output:
true`,
    sampleInput: "listen\nsilent",
    sampleOutput: "true",
    testCases: [
      { input: "listen\nsilent", output: "true", isHidden: false },
      { input: "hello\nworld", output: "false", isHidden: false },
      { input: "a\nb", output: "false", isHidden: true },
    ],
  },

  {
    title: "First Non-Repeating Character",
    difficulty: "medium",
    description: `Find the first character in a string that does not repeat.

Input Format:
A string s.

Output Format:
Print the first non-repeating character. If none exists, print -1.

Example:
Input:
aabbc

Output:
c`,
    sampleInput: "aabbc",
    sampleOutput: "c",
    testCases: [
      { input: "aabbc", output: "c", isHidden: false },
      { input: "aabb", output: "-1", isHidden: false },
      { input: "abc", output: "a", isHidden: true },
    ],
  },

  {
    title: "Remove Duplicates from String",
    difficulty: "easy",
    description: `Remove duplicate characters from a string while preserving order.

Input Format:
A string s.

Output Format:
Print string without duplicates.

Example:
Input:
aabbcc

Output:
abc`,
    sampleInput: "aabbcc",
    sampleOutput: "abc",
    testCases: [
      { input: "aabbcc", output: "abc", isHidden: false },
      { input: "abc", output: "abc", isHidden: false },
      { input: "aaabbbccc", output: "abc", isHidden: true },
    ],
  },

  {
    title: "Count Words",
    difficulty: "easy",
    description: `Count the number of words in a sentence.

Input Format:
A single line string.

Output Format:
Print number of words.

Example:
Input:
hello world

Output:
2`,
    sampleInput: "hello world",
    sampleOutput: "2",
    testCases: [
      { input: "hello world", output: "2", isHidden: false },
      { input: "one two three", output: "3", isHidden: false },
      { input: "single", output: "1", isHidden: true },
    ],
  },

  {
    title: "Check Substring",
    difficulty: "easy",
    description: `Check if string s2 is a substring of string s1.

Input Format:
First line: string s1
Second line: string s2

Output Format:
Print "true" or "false".

Example:
Input:
hello
ell

Output:
true`,
    sampleInput: "hello\nell",
    sampleOutput: "true",
    testCases: [
      { input: "hello\nell", output: "true", isHidden: false },
      { input: "hello\nxyz", output: "false", isHidden: false },
      { input: "abc\na", output: "true", isHidden: true },
    ],
  },

  {
    title: "Longest Word in Sentence",
    difficulty: "easy",
    description: `Find the longest word in a sentence.

Input Format:
A string sentence.

Output Format:
Print the longest word.

Example:
Input:
I love programming

Output:
programming`,
    sampleInput: "I love programming",
    sampleOutput: "programming",
    testCases: [
      { input: "I love programming", output: "programming", isHidden: false },
      { input: "hello world", output: "hello", isHidden: false },
      { input: "a bb ccc", output: "ccc", isHidden: true },
    ],
  },

  {
    title: "Character Frequency",
    difficulty: "medium",
    description: `Find the frequency of each character and print in format: char count (sorted by character).

Input Format:
A string s.

Output Format:
Print each character and its frequency.

Example:
Input:
aab

Output:
a 2
b 1`,
    sampleInput: "aab",
    sampleOutput: "a 2\nb 1",
    testCases: [
      { input: "aab", output: "a 2\nb 1", isHidden: false },
      { input: "abc", output: "a 1\nb 1\nc 1", isHidden: false },
      { input: "aaabb", output: "a 3\nb 2", isHidden: true },
    ],
  },
];

module.exports = problems2;