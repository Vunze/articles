import arxiv
from string import ascii_letters, whitespace

good_chars = (ascii_letters + whitespace).encode()
junk_chars = bytearray(set(range(0x100)) - set(good_chars))


def clean(text):
    return text.encode('ascii', 'ignore').translate(None, junk_chars).decode()


def handle_comment(c: str):
    if not c:
        return None
    words = c.split()
    res = set()
    for word in words:
        if word.isupper():
            res.add(clean(word))
    return res
    end = len(words) - 1
    i = 0
    while i < end:
        if words[i][0].isupper() and words[i + 1][0].isupper():
            end -= 1
            words[i] = words[i] + " " + words[i + 1]
            words.pop(i + 1)
            continue
        i += 1
    return set(words)


def print_set(s):
    for e in s:
        print(e, end=', ')


search = arxiv.Search(
  query="machine learning",
  max_results=3000,
  sort_by=arxiv.SortCriterion.Relevance
)

total_words = set()

count = 1
for result in search.results():
    if count % 100 == 0:
        print("Processed ", count, end=" out of 3000 articles\n")
    count += 1
    processed_comment = handle_comment(result.comment)
    if not processed_comment:
        continue
    total_words.update(processed_comment)
print_set(total_words)
with open("result.txt", "w") as r:
    for conf in total_words:
        r.write(conf)

