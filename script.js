$(document).ready(function () {
  var productsPerPage = 10;
  var totalBoxes = 18;
  var currentPage = 1;

  function populateBoxWithData(product, card) {
    card.find('img').attr('src', product.image);
    card.find('p').text(product.title);
    card.find('.price').text('R$' + product.price.toFixed(2));
    var productId = product.id;
    card.find('p').wrap('<a href="detalhes.html?id=' + productId + '"></a>');
  }

  function fetchData(page) {
    $.get(
      'https://diwserver.vps.webdock.cloud/products?page=' + page,
      function (data) {
        var products = data.products;
        var productCards = $('.box');

        productCards.each(function (index) {
          var productIndex = (page - 1) * productsPerPage + index;
          var product = products[productIndex];
          var card = $(this);

          if (product) {
            populateBoxWithData(product, card);
          } else {
            card.hide();
          }
        });
      }
    );
  }

  fetchData(currentPage);

  $.get('https://diwserver.vps.webdock.cloud/products?page=2', function (data) {
    var products = data.products;
    var productCards = $('.box:hidden');

    productCards.each(function (index) {
      var productIndex = index % productsPerPage;
      var product = products[productIndex];
      var card = $(this);

      if (product) {
        populateBoxWithData(product, card);
        card.show();
      }
    });
  });
});

$(document).ready(function () {
  var productsPerPage = 10;
  var totalBoxes = 18;
  var currentPage = 1;

  function populateBoxWithData(product, card) {
    card.find('img').attr('src', product.image);
    card.find('h1').text(product.title);
    card.find('.price').text('R$' + product.price.toFixed(2));
    var productId = product.id;
    card.find('h1').wrap('<a href="detalhes.html?id=' + productId + '"></a>');
  }

  function fetchData(page) {
    $.get(
      'https://diwserver.vps.webdock.cloud/products?page=' + page,
      function (data) {
        var products = data.products;
        var productCards = $('.produto-recente');

        productCards.each(function (index) {
          var productIndex = (page - 1) * productsPerPage + index;
          var product = products[productIndex];
          var card = $(this);

          if (product) {
            populateBoxWithData(product, card);
          } else {
            card.hide();
          }
        });
      }
    );
  }

  fetchData(currentPage);

  $.get('https://diwserver.vps.webdock.cloud/products?page=2', function (data) {
    var products = data.products;
    var productCards = $('.box:hidden');

    productCards.each(function (index) {
      var productIndex = index % productsPerPage;
      var product = products[productIndex];
      var card = $(this);

      if (product) {
        populateBoxWithData(product, card);
        card.show();
      }
    });
  });
});

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  $.get(
    `https://diwserver.vps.webdock.cloud/products/${id}`,
    function (product) {
      $('#title').text(product.title);
      $('#description').html(product.description);
      $('#price').text('Preço: R$' + product.price + ',00');
      $('#rating').text(
        'Avaliações: ' +
          product.rating.rate.toFixed(1) +
          ' (' +
          product.rating.count +
          ' avaliações no total)'
      );
      $('#image').attr('src', product.image);
    }
  );
});

$(document).ready(function () {
  // Manipular envio do formulário
  $('form').submit(function (evento) {
    evento.preventDefault();

    const termoBusca = $('#search').val().toLowerCase();
    const categoriaSelecionada = $('#tipo').val();

    const url = `pesquisa.html?search=${termoBusca}&category=${categoriaSelecionada}`;

    window.open(url, '_blank');
  });
  const buscarProdutosFiltrados = async () => {
    const totalPaginas = 15;
    let pagina;
    const produtos = [];

    for (pagina = 1; pagina <= totalPaginas; pagina++) {
      const data = await $.get(
        `https://diwserver.vps.webdock.cloud/products?page=${pagina}`
      );

      const resultadosBusca = data.products.filter((produto) =>
        produto.title.toLowerCase().includes(termoBusca)
      );

      const resultadosFiltrados = categoriaSelecionada
        ? resultadosBusca.filter(
            (produto) => produto.category === categoriaSelecionada
          )
        : resultadosBusca;

      produtos.push(...resultadosFiltrados);
    }

    return produtos;
  };

  const urlParams = new URLSearchParams(window.location.search);
  const termoBusca = urlParams.get('search');
  const categoriaSelecionada = urlParams.get('category');

  buscarProdutosFiltrados()
    .then((produtos) => {
      const containerCards = $('#cards');

      if (produtos.length === 0) {
        containerCards.html('<p>Nenhum produto encontrado.</p>');
      } else {
        const htmlCards = produtos.map(
          (produto) => `
            <div class="col-8 col-md-6 col-sm-6 mb-3 col-lg-3">
              <div class="card produto-card-busca">
                <img src="${
                  produto.image
                }" class="card-img-top imagem-card-busca-produto" alt="${
            produto.title
          }" />
                <div class="card-body">
                  <a href="detalhes.html?id=${produto.id}">
                    <h6 class="card-title">${produto.title}</h6>
                  </a>
                  <div class="descricao-container">
                    <p class="card-text">${produto.description}</p>
                  </div>
                  <div class="preco">R$ ${produto.price.toFixed(2)}</div>
                  <div class="avaliacao">★★★★☆ (${produto.rating.rate})</div>
                </div>
              </div>
            </div>
          `
        );

        containerCards.html(htmlCards.join(''));
      }
    })
    .catch((error) => {
      console.error('Erro:', error);
      $('#cards').html('<p>Ocorreu um erro ao buscar os produtos.</p>');
    });

  const selectCategoria = $('#tipo');

  $.ajax({
    url: 'https://diwserver.vps.webdock.cloud/products/categories',
    method: 'GET',
    success: function (response) {
      response.forEach(function (categoria) {
        selectCategoria.append(
          $('<option>', {
            value: categoria,
            text: categoria,
          })
        );
      });

      // Definir a categoria selecionada com base no parâmetro da URL
      selectCategoria.val(categoriaSelecionada);
    },
    error: function (error) {
      console.error('Erro:', error);
    },
  });
});
