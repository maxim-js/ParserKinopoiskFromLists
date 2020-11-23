const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
let link = 'https://www.kinopoisk.ru/lists/navigator/?page='
let tab = '&quick_filters=films&tab=all'

const parse = async () => {
    try {
        let arr = []
        let i = 1
        let flag = false

        while (true) {
            console.log('step - ', i);
            await axios.get(link + i + tab)
                .then(res => res.data)
                .then(res => {
                    let html = res
                    $ = cheerio.load(html)
                    // let pagination = $('a.paginator__page-relative').html()
                    $(html).find('div.desktop-seo-selection-film-item.selection-list__film').each((index, element) => {
                        let item = {
                            img: $(element).find('img.selection-film-item-poster__image').attr('src'),
                            name: $(element).find('p.selection-film-item-meta__name').text(),
                            date: $(element).find('p.selection-film-item-meta__original-name').text(),
                            zhanr: $(element).find('p.selection-film-item-meta__meta-additional').text(),
                            rating: $(element).find('span.rating__value rating__value_positive').text(),
                            view: $(element).find('span.rating__count').text()

                        }
                        arr.push(item)
                    })

                    if (i > 2) {
                        flag = true
                    }
                })
                .catch(err => console.log(err))



            if (flag) {
                console.log(("All items= ", arr.length));
                fs.writeFile('kinopoisk.json', JSON.stringify(arr), function (err) {
                    if (err) throw err
                    console.log('Saved kinopoisk.json');
                })
                break
            }
            i++
        }
    } catch (e) {
        console.log('err - ', e);
    }
}

parse()