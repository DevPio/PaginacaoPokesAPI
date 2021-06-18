async function totalPoke(limit, of) {
  const pokes = await fetch(
    `https://pokeapi.co/api/v2/ability/?limit=${limit}&offset=${of}`
  );

  const parsePokes = await pokes.json();

  return parsePokes.results;
}
let containerPokes = document.querySelector(".pokes");
class Pagination {
  constructor(pages, pageSelect = 1, totalItems = 103, limitePage = 4) {
    this.pages = pages;
    this.pageSelect = pageSelect;
    this.totalItems = totalItems;
    this.limitePage = limitePage;

    this.construirPaginas();
  }

  construirPaginas() {
    this.pages = !(this.totalItems % this.limitePage)
      ? Math.floor(this.totalItems / this.limitePage)
      : Math.floor(this.totalItems / this.limitePage) + 1;

    let itemsRenderizar = null;

    if (this.pageSelect == this.pages) {
      let jaRenderizados = (this.pageSelect - 1) * this.limitePage;

      itemsRenderizar = this.totalItems - jaRenderizados;
    } else {
      itemsRenderizar = this.limitePage;
    }

    return itemsRenderizar;
  }

  construirNumerosSelecao() {
    let iteradorLimit = this.pages;
    let pages = [];
    for (let index = 1; index <= iteradorLimit; index++) {
      if (this.pageSelect <= 4 && index <= 4) {
        pages.push(index);
        if (index == 4) {
          pages.push(index + 1);

          pages.push("...");
          pages.push(iteradorLimit);
        }
      }

      if (
        this.pageSelect >= 5 &&
        this.pageSelect < iteradorLimit - 3 &&
        index > 4
      ) {
        if (index == this.pageSelect) {
          pages.push(1);
          pages.push("...");
          pages.push(index - 1);
          pages.push(index);
          pages.push(index + 1);
          pages.push("...");
          pages.push(iteradorLimit);
        }
      }

      if (this.pageSelect >= iteradorLimit - 3 && index >= iteradorLimit - 3) {
        if (index == iteradorLimit - 3) {
          pages.push(1);
          pages.push("...");
          pages.push(iteradorLimit - 4);
        }
        pages.push(index);
      }
    }

    return pages;
  }

  construirDom(index) {
    let itemsConstruir = this.construirNumerosSelecao();

    const template = itemsConstruir
      .map((item) => {
        let templateHtml = "";
        if (!isNaN(item)) {
          if (item == index) {
            templateHtml += `<div class="select">${item}</div>`;
          } else {
            templateHtml += `<div >${item}</div>`;
          }
        } else {
          templateHtml += `<span>${item}</span>`;
        }

        return templateHtml;
      })
      .join("");

    return template;
  }

  renderPoke(pokes) {
    return pokes
      .map((poke) => {
        return `<div><p>${poke.name}</p></div>`;
      })
      .join("");
  }
  async pageSelectConstrutor(index) {
    this.pageSelect = index;

    let pages = this.construirPaginas();
    let itens = await totalPoke(pages, index);
    let pokesTemplate = this.renderPoke(itens);
    containerPokes.innerHTML = pokesTemplate;
    return this.construirDom(index);
  }
}
const elementRender = document.querySelector(".container");

const pages = new Pagination();

elementRender.innerHTML = pages.construirDom(1);

pages.pageSelectConstrutor(1).then((r) => {
  const divsNumbers = document.querySelectorAll("div");

  divsNumbers.forEach((div) => {
    div.addEventListener("click", function (event) {
      let number = event.target.textContent;
      if (!isNaN(number)) {
        pages.pageSelectConstrutor(number).then((r) => {
          elementRender.innerHTML = r;
        });
      }
    });
  });
});
