import json

source = "the cat I love eat the cake"
dest = "le chat que j'aime mange le gâteau"

probsEF = json.loads(open('probabilitati_en-fr_v2.json',
                     'r', encoding='utf8').read())
probsFE = json.loads(open('probabilitati_fr-en_v2.json',
                     'r', encoding='utf8').read())


def matrix(source, dest, probs):
    src = source.split()
    dst = dest.split()

    m = dict()
    mat = list()
    for word_en in src:
        if word_en not in m:
            m[word_en] = dict()
        for word_fr in dst:
            if word_fr in probs[word_en]:
                m[word_en][word_fr] = probs[word_en][word_fr]
            else:
                m[word_en][word_fr] = 0

        candidates = list()
        maximum = max(m[word_en].values())
        for word_fr in dst:
            if m[word_en][word_fr] is maximum:
                candidates.append(word_fr)

        candidates = list(set(candidates))
        mat.append([word_en, candidates])

    return mat


def get_first_alignment(source, m):
    phrases = list()
    for i in range(len(m)):
        new_en = [m[i][0]]
        for j in range(len(m)):
            if i != j and abs(i-j) == 1 and not set(m[i][1]).isdisjoint(m[j][1]):
                new_en.append(m[j][0])
        new_en = ' '.join(new_en)

        if new_en in source:
            phrases.append([new_en, ' '.join(m[i][1])])

    return phrases


def get_phrases(fa):
    src = list()
    for i in range(len(fa)):
        src.append(fa[i][0])

    # 0-1, 1-2, 2-3, 3-4, 4-5
    # 0-2, 1-3, 2-4, 3-5
    # 0-3, 1-4, 2-5
    # 0-4, 1-5
    # 0-5
    phrases = list()
    for i in range(2, len(fa) + 1):
        for j in range(len(fa) - i + 1):
            temp_en = src[j:j+i]
            temp_fr = list()
            for k in range(j, j+i):
                temp_fr.append(fa[k][1])
            phrases.append([' '.join(temp_en), ' '.join(temp_fr)])

    return phrases


def symmetrize_alignment(source, dest):
    m1 = matrix(source, dest, probsEF)
    m2 = matrix(dest, source, probsFE)
    pass


if __name__ == '__main__':
    symmetrize_alignment(source, dest)

    m = matrix(source, dest, probsEF)
    a = get_first_alignment(source, m)
    print(a)
    p = get_phrases(a)
    print(p)

    # test = [
    #     ['mary', ['maria']],
    #     ['did', ['no']],
    #     ['not', ['no']],
    #     ['slap', ['daba', 'una', 'bofetada']],
    #     ['the', ['a', 'la']],
    #     ['green', ['verde']],
    #     ['witch', ['bruja']]
    # ]
    # s = 'mary did not slap the green witch'
    # d = 'maria no daba una bofetada a la bruja verde'
    # a = get_first_alignment(s, test)
    # print(a)
    # p = get_phrases(a)
    # print(p)
