-- Seed sample questions for Winter Arc (180 questions for 90 days)
-- This is a sample set - you can modify these questions as needed

INSERT INTO public.questions (title, question_url, difficulty, coins, topic, day_number, question_order) VALUES
-- Day 1
('Two Sum', 'https://leetcode.com/problems/two-sum/', 'easy', 30, 'Arrays', 1, 1),
('Valid Parentheses', 'https://leetcode.com/problems/valid-parentheses/', 'easy', 30, 'Stack', 1, 2),

-- Day 2
('Merge Two Sorted Lists', 'https://leetcode.com/problems/merge-two-sorted-lists/', 'easy', 30, 'Linked List', 2, 1),
('Best Time to Buy and Sell Stock', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', 'easy', 30, 'Arrays', 2, 2),

-- Day 3
('Contains Duplicate', 'https://leetcode.com/problems/contains-duplicate/', 'easy', 30, 'Arrays', 3, 1),
('Maximum Subarray', 'https://leetcode.com/problems/maximum-subarray/', 'medium', 50, 'Dynamic Programming', 3, 2),

-- Day 4
('Product of Array Except Self', 'https://leetcode.com/problems/product-of-array-except-self/', 'medium', 50, 'Arrays', 4, 1),
('3Sum', 'https://leetcode.com/problems/3sum/', 'medium', 50, 'Arrays', 4, 2),

-- Day 5
('Container With Most Water', 'https://leetcode.com/problems/container-with-most-water/', 'medium', 50, 'Two Pointers', 5, 1),
('Longest Substring Without Repeating Characters', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', 'medium', 50, 'Sliding Window', 5, 2),

-- Day 6
('Longest Palindromic Substring', 'https://leetcode.com/problems/longest-palindromic-substring/', 'medium', 50, 'String', 6, 1),
('Reverse Linked List', 'https://leetcode.com/problems/reverse-linked-list/', 'easy', 30, 'Linked List', 6, 2),

-- Day 7
('Linked List Cycle', 'https://leetcode.com/problems/linked-list-cycle/', 'easy', 30, 'Linked List', 7, 1),
('Reorder List', 'https://leetcode.com/problems/reorder-list/', 'medium', 50, 'Linked List', 7, 2),

-- Day 8
('Remove Nth Node From End of List', 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', 'medium', 50, 'Linked List', 8, 1),
('Copy List with Random Pointer', 'https://leetcode.com/problems/copy-list-with-random-pointer/', 'medium', 50, 'Linked List', 8, 2),

-- Day 9
('Add Two Numbers', 'https://leetcode.com/problems/add-two-numbers/', 'medium', 50, 'Linked List', 9, 1),
('Find Minimum in Rotated Sorted Array', 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', 'medium', 50, 'Binary Search', 9, 2),

-- Day 10
('Search in Rotated Sorted Array', 'https://leetcode.com/problems/search-in-rotated-sorted-array/', 'medium', 50, 'Binary Search', 10, 1),
('Binary Tree Inorder Traversal', 'https://leetcode.com/problems/binary-tree-inorder-traversal/', 'easy', 30, 'Trees', 10, 2),

-- Continue pattern for remaining 80 days (170 more questions)
-- Day 11-20: Mix of medium and hard problems
('Binary Tree Level Order Traversal', 'https://leetcode.com/problems/binary-tree-level-order-traversal/', 'medium', 50, 'Trees', 11, 1),
('Maximum Depth of Binary Tree', 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', 'easy', 30, 'Trees', 11, 2),
('Same Tree', 'https://leetcode.com/problems/same-tree/', 'easy', 30, 'Trees', 12, 1),
('Invert Binary Tree', 'https://leetcode.com/problems/invert-binary-tree/', 'easy', 30, 'Trees', 12, 2),
('Validate Binary Search Tree', 'https://leetcode.com/problems/validate-binary-search-tree/', 'medium', 50, 'Trees', 13, 1),
('Kth Smallest Element in a BST', 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', 'medium', 50, 'Trees', 13, 2),
('Construct Binary Tree from Preorder and Inorder', 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', 'medium', 50, 'Trees', 14, 1),
('Binary Tree Maximum Path Sum', 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', 'hard', 70, 'Trees', 14, 2),
('Serialize and Deserialize Binary Tree', 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', 'hard', 70, 'Trees', 15, 1),
('Subtree of Another Tree', 'https://leetcode.com/problems/subtree-of-another-tree/', 'easy', 30, 'Trees', 15, 2),
('Lowest Common Ancestor of BST', 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', 'medium', 50, 'Trees', 16, 1),
('Implement Trie', 'https://leetcode.com/problems/implement-trie-prefix-tree/', 'medium', 50, 'Trie', 16, 2),
('Design Add and Search Words Data Structure', 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', 'medium', 50, 'Trie', 17, 1),
('Word Search II', 'https://leetcode.com/problems/word-search-ii/', 'hard', 70, 'Trie', 17, 2),
('Number of Islands', 'https://leetcode.com/problems/number-of-islands/', 'medium', 50, 'Graph', 18, 1),
('Clone Graph', 'https://leetcode.com/problems/clone-graph/', 'medium', 50, 'Graph', 18, 2),
('Pacific Atlantic Water Flow', 'https://leetcode.com/problems/pacific-atlantic-water-flow/', 'medium', 50, 'Graph', 19, 1),
('Course Schedule', 'https://leetcode.com/problems/course-schedule/', 'medium', 50, 'Graph', 19, 2),
('Course Schedule II', 'https://leetcode.com/problems/course-schedule-ii/', 'medium', 50, 'Graph', 20, 1),
('Graph Valid Tree', 'https://leetcode.com/problems/graph-valid-tree/', 'medium', 50, 'Graph', 20, 2),

-- Day 21-30: Advanced problems
('Number of Connected Components', 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', 'medium', 50, 'Graph', 21, 1),
('Alien Dictionary', 'https://leetcode.com/problems/alien-dictionary/', 'hard', 70, 'Graph', 21, 2),
('Climbing Stairs', 'https://leetcode.com/problems/climbing-stairs/', 'easy', 30, 'Dynamic Programming', 22, 1),
('House Robber', 'https://leetcode.com/problems/house-robber/', 'medium', 50, 'Dynamic Programming', 22, 2),
('House Robber II', 'https://leetcode.com/problems/house-robber-ii/', 'medium', 50, 'Dynamic Programming', 23, 1),
('Longest Increasing Subsequence', 'https://leetcode.com/problems/longest-increasing-subsequence/', 'medium', 50, 'Dynamic Programming', 23, 2),
('Coin Change', 'https://leetcode.com/problems/coin-change/', 'medium', 50, 'Dynamic Programming', 24, 1),
('Word Break', 'https://leetcode.com/problems/word-break/', 'medium', 50, 'Dynamic Programming', 24, 2),
('Combination Sum IV', 'https://leetcode.com/problems/combination-sum-iv/', 'medium', 50, 'Dynamic Programming', 25, 1),
('Decode Ways', 'https://leetcode.com/problems/decode-ways/', 'medium', 50, 'Dynamic Programming', 25, 2),
('Unique Paths', 'https://leetcode.com/problems/unique-paths/', 'medium', 50, 'Dynamic Programming', 26, 1),
('Jump Game', 'https://leetcode.com/problems/jump-game/', 'medium', 50, 'Dynamic Programming', 26, 2),
('Palindromic Substrings', 'https://leetcode.com/problems/palindromic-substrings/', 'medium', 50, 'Dynamic Programming', 27, 1),
('Longest Common Subsequence', 'https://leetcode.com/problems/longest-common-subsequence/', 'medium', 50, 'Dynamic Programming', 27, 2),
('Edit Distance', 'https://leetcode.com/problems/edit-distance/', 'hard', 70, 'Dynamic Programming', 28, 1),
('Distinct Subsequences', 'https://leetcode.com/problems/distinct-subsequences/', 'hard', 70, 'Dynamic Programming', 28, 2),
('Regular Expression Matching', 'https://leetcode.com/problems/regular-expression-matching/', 'hard', 70, 'Dynamic Programming', 29, 1),
('Wildcard Matching', 'https://leetcode.com/problems/wildcard-matching/', 'hard', 70, 'Dynamic Programming', 29, 2),
('Burst Balloons', 'https://leetcode.com/problems/burst-balloons/', 'hard', 70, 'Dynamic Programming', 30, 1),
('Maximal Rectangle', 'https://leetcode.com/problems/maximal-rectangle/', 'hard', 70, 'Dynamic Programming', 30, 2),

-- Day 31-90: Continue with diverse topics (120 more questions needed)
-- Adding more questions across various topics
('Min Stack', 'https://leetcode.com/problems/min-stack/', 'medium', 50, 'Stack', 31, 1),
('Evaluate Reverse Polish Notation', 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', 'medium', 50, 'Stack', 31, 2),
('Generate Parentheses', 'https://leetcode.com/problems/generate-parentheses/', 'medium', 50, 'Backtracking', 32, 1),
('Daily Temperatures', 'https://leetcode.com/problems/daily-temperatures/', 'medium', 50, 'Stack', 32, 2),
('Car Fleet', 'https://leetcode.com/problems/car-fleet/', 'medium', 50, 'Stack', 33, 1),
('Largest Rectangle in Histogram', 'https://leetcode.com/problems/largest-rectangle-in-histogram/', 'hard', 70, 'Stack', 33, 2),
('Binary Search', 'https://leetcode.com/problems/binary-search/', 'easy', 30, 'Binary Search', 34, 1),
('Search a 2D Matrix', 'https://leetcode.com/problems/search-a-2d-matrix/', 'medium', 50, 'Binary Search', 34, 2),
('Koko Eating Bananas', 'https://leetcode.com/problems/koko-eating-bananas/', 'medium', 50, 'Binary Search', 35, 1),
('Find Peak Element', 'https://leetcode.com/problems/find-peak-element/', 'medium', 50, 'Binary Search', 35, 2),
('Time Based Key-Value Store', 'https://leetcode.com/problems/time-based-key-value-store/', 'medium', 50, 'Binary Search', 36, 1),
('Median of Two Sorted Arrays', 'https://leetcode.com/problems/median-of-two-sorted-arrays/', 'hard', 70, 'Binary Search', 36, 2),
('Permutations', 'https://leetcode.com/problems/permutations/', 'medium', 50, 'Backtracking', 37, 1),
('Subsets', 'https://leetcode.com/problems/subsets/', 'medium', 50, 'Backtracking', 37, 2),
('Combination Sum', 'https://leetcode.com/problems/combination-sum/', 'medium', 50, 'Backtracking', 38, 1),
('Word Search', 'https://leetcode.com/problems/word-search/', 'medium', 50, 'Backtracking', 38, 2),
('Palindrome Partitioning', 'https://leetcode.com/problems/palindrome-partitioning/', 'medium', 50, 'Backtracking', 39, 1),
('Letter Combinations of a Phone Number', 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', 'medium', 50, 'Backtracking', 39, 2),
('N-Queens', 'https://leetcode.com/problems/n-queens/', 'hard', 70, 'Backtracking', 40, 1),
('Sudoku Solver', 'https://leetcode.com/problems/sudoku-solver/', 'hard', 70, 'Backtracking', 40, 2)

ON CONFLICT (day_number, question_order) DO NOTHING;

-- Note: This seeds 80 questions (40 days). You'll need to add 100 more questions for days 41-90
-- to complete the full 180 questions for the 90-day Winter Arc challenge.
