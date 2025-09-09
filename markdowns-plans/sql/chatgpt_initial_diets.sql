


INSERT INTO diets 
(slug, title, description, tags, category, difficulty, duration_weeks, popularity_score, is_public, created_at, updated_at, calories_total, macros, week_plan)
VALUES
(
  'mediterranea-2400',
  'Dieta Mediterrânea (2400 kcal)',
  'Plano inspirado no padrão alimentar mediterrâneo, com ênfase em azeite de oliva, peixes, legumes e cereais integrais. Versão ajustada para 2400 kcal por dia.',
  '{"mediterranea","equilibrada","saude"}',
  'equilibrada',
  'intermediario',
  6,
  18,
  TRUE,
  NOW(),
  NOW(),
  2400,
  '{
    "proteina": 140,
    "carboidrato": 240,
    "gordura": 90
  }',
  '{
    "days": [
      {
        "day_index": 0,
        "meals": [
          {
            "name": "Café da manhã",
            "items": [
              {
                "name": "Iogurte natural integral",
                "quantity": 300,
                "unit": "g",
                "alt_items": [
                  { "name": "Iogurte grego natural", "quantity": 250, "unit": "g" },
                  { "name": "Kefir", "quantity": 300, "unit": "ml" }
                ]
              },
              {
                "name": "Aveia em flocos",
                "quantity": 60,
                "unit": "g",
                "alt_items": [
                  { "name": "Granola sem açúcar", "quantity": 55, "unit": "g" },
                  { "name": "Centeio em flocos", "quantity": 60, "unit": "g" }
                ]
              },
              {
                "name": "Morangos",
                "quantity": 180,
                "unit": "g",
                "alt_items": [
                  { "name": "Mirtilos", "quantity": 150, "unit": "g" },
                  { "name": "Maçã", "quantity": 1, "unit": "unidade" }
                ]
              }
            ],
            "calories": 550
          },
          {
            "name": "Almoço",
            "items": [
              {
                "name": "Peito de frango grelhado",
                "quantity": 180,
                "unit": "g",
                "alt_items": [
                  { "name": "Peixe branco grelhado", "quantity": 180, "unit": "g" },
                  { "name": "Grão-de-bico cozido", "quantity": 150, "unit": "g" }
                ]
              },
              {
                "name": "Arroz integral",
                "quantity": 130,
                "unit": "g",
                "alt_items": [
                  { "name": "Cevada cozida", "quantity": 130, "unit": "g" },
                  { "name": "Quinoa cozida", "quantity": 120, "unit": "g" }
                ]
              },
              {
                "name": "Brócolis cozidos",
                "quantity": 180,
                "unit": "g",
                "alt_items": [
                  { "name": "Couve-flor", "quantity": 180, "unit": "g" },
                  { "name": "Abobrinha", "quantity": 180, "unit": "g" }
                ]
              },
              {
                "name": "Azeite de oliva",
                "quantity": 25,
                "unit": "ml",
                "alt_items": [
                  { "name": "Azeite de abacate", "quantity": 25, "unit": "ml" },
                  { "name": "Sementes de linhaça", "quantity": 25, "unit": "g" }
                ]
              }
            ],
            "calories": 700
          },
          {
            "name": "Lanche da tarde",
            "items": [
              {
                "name": "Nozes",
                "quantity": 40,
                "unit": "g",
                "alt_items": [
                  { "name": "Amêndoas", "quantity": 40, "unit": "g" },
                  { "name": "Castanha-do-pará", "quantity": 30, "unit": "g" }
                ]
              },
              {
                "name": "Pera",
                "quantity": 1,
                "unit": "unidade",
                "alt_items": [
                  { "name": "Maçã", "quantity": 1, "unit": "unidade" },
                  { "name": "Laranja", "quantity": 1, "unit": "unidade" }
                ]
              }
            ],
            "calories": 350
          },
          {
            "name": "Jantar",
            "items": [
              {
                "name": "Peixe grelhado",
                "quantity": 200,
                "unit": "g",
                "alt_items": [
                  { "name": "Frango grelhado", "quantity": 200, "unit": "g" },
                  { "name": "Ovos cozidos", "quantity": 3, "unit": "unidades" }
                ]
              },
              {
                "name": "Salada de folhas (alface, rúcula, tomate)",
                "quantity": 220,
                "unit": "g",
                "alt_items": [
                  { "name": "Espinafre cru", "quantity": 220, "unit": "g" },
                  { "name": "Couve", "quantity": 200, "unit": "g" }
                ]
              },
              {
                "name": "Batata-doce assada",
                "quantity": 150,
                "unit": "g",
                "alt_items": [
                  { "name": "Abóbora assada", "quantity": 150, "unit": "g" },
                  { "name": "Inhame cozido", "quantity": 150, "unit": "g" }
                ]
              }
            ],
            "calories": 650
          }
        ]
      }
    ]
  }'
);


INSERT INTO diets 
(slug, title, description, tags, category, difficulty, duration_weeks, popularity_score, is_public, created_at, updated_at, calories_total, macros, week_plan)
VALUES
(
  'mediterranea-2000',
  'Dieta Mediterrânea (2000 kcal)',
  'Plano inspirado no padrão alimentar mediterrâneo, com ênfase em azeite de oliva, peixes, legumes e cereais integrais. Versão ajustada para 2000 kcal por dia.',
  '{"mediterranea","equilibrada","saude"}',
  'equilibrada',
  'intermediario',
  6,
  17,
  TRUE,
  NOW(),
  NOW(),
  2000,
  '{
    "proteina": 120,
    "carboidrato": 200,
    "gordura": 75
  }',
  '{
    "days": [
      {
        "day_index": 0,
        "meals": [
          {
            "name": "Café da manhã",
            "items": [
              {
                "name": "Iogurte natural integral",
                "quantity": 250,
                "unit": "g",
                "alt_items": [
                  { "name": "Iogurte grego natural", "quantity": 200, "unit": "g" },
                  { "name": "Kefir", "quantity": 250, "unit": "ml" }
                ]
              },
              {
                "name": "Aveia em flocos",
                "quantity": 50,
                "unit": "g",
                "alt_items": [
                  { "name": "Granola sem açúcar", "quantity": 45, "unit": "g" },
                  { "name": "Centeio em flocos", "quantity": 50, "unit": "g" }
                ]
              },
              {
                "name": "Morangos",
                "quantity": 150,
                "unit": "g",
                "alt_items": [
                  { "name": "Mirtilos", "quantity": 120, "unit": "g" },
                  { "name": "Maçã", "quantity": 1, "unit": "unidade" }
                ]
              }
            ],
            "calories": 450
          },
          {
            "name": "Almoço",
            "items": [
              {
                "name": "Peito de frango grelhado",
                "quantity": 150,
                "unit": "g",
                "alt_items": [
                  { "name": "Peixe branco grelhado", "quantity": 150, "unit": "g" },
                  { "name": "Grão-de-bico cozido", "quantity": 120, "unit": "g" }
                ]
              },
              {
                "name": "Arroz integral",
                "quantity": 110,
                "unit": "g",
                "alt_items": [
                  { "name": "Cevada cozida", "quantity": 110, "unit": "g" },
                  { "name": "Quinoa cozida", "quantity": 100, "unit": "g" }
                ]
              },
              {
                "name": "Brócolis cozidos",
                "quantity": 150,
                "unit": "g",
                "alt_items": [
                  { "name": "Couve-flor", "quantity": 150, "unit": "g" },
                  { "name": "Abobrinha", "quantity": 150, "unit": "g" }
                ]
              },
              {
                "name": "Azeite de oliva",
                "quantity": 20,
                "unit": "ml",
                "alt_items": [
                  { "name": "Azeite de abacate", "quantity": 20, "unit": "ml" },
                  { "name": "Sementes de linhaça", "quantity": 20, "unit": "g" }
                ]
              }
            ],
            "calories": 600
          },
          {
            "name": "Lanche da tarde",
            "items": [
              {
                "name": "Nozes",
                "quantity": 30,
                "unit": "g",
                "alt_items": [
                  { "name": "Amêndoas", "quantity": 30, "unit": "g" },
                  { "name": "Castanha-do-pará", "quantity": 25, "unit": "g" }
                ]
              },
              {
                "name": "Pera",
                "quantity": 1,
                "unit": "unidade",
                "alt_items": [
                  { "name": "Maçã", "quantity": 1, "unit": "unidade" },
                  { "name": "Laranja", "quantity": 1, "unit": "unidade" }
                ]
              }
            ],
            "calories": 300
          },
          {
            "name": "Jantar",
            "items": [
              {
                "name": "Peixe grelhado",
                "quantity": 180,
                "unit": "g",
                "alt_items": [
                  { "name": "Frango grelhado", "quantity": 180, "unit": "g" },
                  { "name": "Ovos cozidos", "quantity": 3, "unit": "unidades" }
                ]
              },
              {
                "name": "Salada de folhas (alface, rúcula, tomate)",
                "quantity": 200,
                "unit": "g",
                "alt_items": [
                  { "name": "Espinafre cru", "quantity": 200, "unit": "g" },
                  { "name": "Couve", "quantity": 180, "unit": "g" }
                ]
              },
              {
                "name": "Batata-doce assada",
                "quantity": 120,
                "unit": "g",
                "alt_items": [
                  { "name": "Abóbora assada", "quantity": 120, "unit": "g" },
                  { "name": "Inhame cozido", "quantity": 120, "unit": "g" }
                ]
              }
            ],
            "calories": 500
          }
        ]
      }
    ]
  }'
);



INSERT INTO diets 
(slug, title, description, tags, category, difficulty, duration_weeks, popularity_score, is_public, created_at, updated_at, calories_total, macros, week_plan)
VALUES
(
  'mediterranea-1600',
  'Dieta Mediterrânea (1600 kcal)',
  'Plano inspirado no padrão alimentar mediterrâneo, com ênfase em azeite de oliva, peixes, legumes e cereais integrais. Versão ajustada para 1600 kcal por dia.',
  '{"mediterranea","equilibrada","saude"}',
  'equilibrada',
  'iniciante',
  6,
  15,
  TRUE,
  NOW(),
  NOW(),
  1600,
  '{
    "proteina": 95,
    "carboidrato": 160,
    "gordura": 60
  }',
  '{
    "days": [
      {
        "day_index": 0,
        "meals": [
          {
            "name": "Café da manhã",
            "items": [
              {
                "name": "Iogurte natural integral",
                "quantity": 200,
                "unit": "g",
                "alt_items": [
                  { "name": "Iogurte grego natural", "quantity": 150, "unit": "g" },
                  { "name": "Kefir", "quantity": 200, "unit": "ml" }
                ]
              },
              {
                "name": "Aveia em flocos",
                "quantity": 40,
                "unit": "g",
                "alt_items": [
                  { "name": "Granola sem açúcar", "quantity": 35, "unit": "g" },
                  { "name": "Centeio em flocos", "quantity": 40, "unit": "g" }
                ]
              },
              {
                "name": "Morangos",
                "quantity": 120,
                "unit": "g",
                "alt_items": [
                  { "name": "Mirtilos", "quantity": 100, "unit": "g" },
                  { "name": "Maçã", "quantity": 1, "unit": "unidade" }
                ]
              }
            ],
            "calories": 380
          },
          {
            "name": "Almoço",
            "items": [
              {
                "name": "Peito de frango grelhado",
                "quantity": 130,
                "unit": "g",
                "alt_items": [
                  { "name": "Peixe branco grelhado", "quantity": 130, "unit": "g" },
                  { "name": "Grão-de-bico cozido", "quantity": 100, "unit": "g" }
                ]
              },
              {
                "name": "Arroz integral",
                "quantity": 90,
                "unit": "g",
                "alt_items": [
                  { "name": "Cevada cozida", "quantity": 90, "unit": "g" },
                  { "name": "Quinoa cozida", "quantity": 80, "unit": "g" }
                ]
              },
              {
                "name": "Brócolis cozidos",
                "quantity": 120,
                "unit": "g",
                "alt_items": [
                  { "name": "Couve-flor", "quantity": 120, "unit": "g" },
                  { "name": "Abobrinha", "quantity": 130, "unit": "g" }
                ]
              },
              {
                "name": "Azeite de oliva",
                "quantity": 15,
                "unit": "ml",
                "alt_items": [
                  { "name": "Azeite de abacate", "quantity": 15, "unit": "ml" },
                  { "name": "Sementes de linhaça", "quantity": 15, "unit": "g" }
                ]
              }
            ],
            "calories": 500
          },
          {
            "name": "Lanche da tarde",
            "items": [
              {
                "name": "Nozes",
                "quantity": 25,
                "unit": "g",
                "alt_items": [
                  { "name": "Amêndoas", "quantity": 25, "unit": "g" },
                  { "name": "Castanha-do-pará", "quantity": 20, "unit": "g" }
                ]
              },
              {
                "name": "Pera",
                "quantity": 1,
                "unit": "unidade",
                "alt_items": [
                  { "name": "Maçã", "quantity": 1, "unit": "unidade" },
                  { "name": "Laranja", "quantity": 1, "unit": "unidade" }
                ]
              }
            ],
            "calories": 250
          },
          {
            "name": "Jantar",
            "items": [
              {
                "name": "Peixe grelhado",
                "quantity": 150,
                "unit": "g",
                "alt_items": [
                  { "name": "Frango grelhado", "quantity": 150, "unit": "g" },
                  { "name": "Ovos cozidos", "quantity": 3, "unit": "unidades" }
                ]
              },
              {
                "name": "Salada de folhas (alface, rúcula, tomate)",
                "quantity": 180,
                "unit": "g",
                "alt_items": [
                  { "name": "Espinafre cru", "quantity": 180, "unit": "g" },
                  { "name": "Couve", "quantity": 150, "unit": "g" }
                ]
              },
              {
                "name": "Batata-doce assada",
                "quantity": 100,
                "unit": "g",
                "alt_items": [
                  { "name": "Abóbora assada", "quantity": 100, "unit": "g" },
                  { "name": "Inhame cozido", "quantity": 100, "unit": "g" }
                ]
              }
            ],
            "calories": 470
          }
        ]
      }
    ]
  }'
);


INSERT INTO diets 
(slug, title, description, tags, category, difficulty, duration_weeks, popularity_score, is_public, created_at, updated_at, calories_total, macros, week_plan)
VALUES
(
  'mediterranea-1200',
  'Dieta Mediterrânea (1200 kcal)',
  'Plano inspirado no padrão alimentar mediterrâneo, com ênfase em azeite de oliva, peixes, legumes e cereais integrais. Versão ajustada para 1200 kcal por dia.',
  '{"mediterranea","equilibrada","saude"}',
  'equilibrada',
  'iniciante',
  6,
  14,
  TRUE,
  NOW(),
  NOW(),
  1200,
  '{
    "proteina": 70,
    "carboidrato": 120,
    "gordura": 45
  }',
  '{
    "days": [
      {
        "day_index": 0,
        "meals": [
          {
            "name": "Café da manhã",
            "items": [
              {
                "name": "Iogurte natural desnatado",
                "quantity": 150,
                "unit": "g",
                "alt_items": [
                  { "name": "Iogurte grego light", "quantity": 120, "unit": "g" },
                  { "name": "Kefir natural", "quantity": 150, "unit": "ml" }
                ]
              },
              {
                "name": "Aveia em flocos",
                "quantity": 30,
                "unit": "g",
                "alt_items": [
                  { "name": "Granola sem açúcar", "quantity": 25, "unit": "g" },
                  { "name": "Centeio em flocos", "quantity": 30, "unit": "g" }
                ]
              },
              {
                "name": "Morangos",
                "quantity": 100,
                "unit": "g",
                "alt_items": [
                  { "name": "Mirtilos", "quantity": 80, "unit": "g" },
                  { "name": "Maçã", "quantity": 1, "unit": "unidade" }
                ]
              }
            ],
            "calories": 300
          },
          {
            "name": "Almoço",
            "items": [
              {
                "name": "Peito de frango grelhado",
                "quantity": 100,
                "unit": "g",
                "alt_items": [
                  { "name": "Peixe branco grelhado", "quantity": 100, "unit": "g" },
                  { "name": "Grão-de-bico cozido", "quantity": 80, "unit": "g" }
                ]
              },
              {
                "name": "Arroz integral",
                "quantity": 70,
                "unit": "g",
                "alt_items": [
                  { "name": "Cevada cozida", "quantity": 70, "unit": "g" },
                  { "name": "Quinoa cozida", "quantity": 60, "unit": "g" }
                ]
              },
              {
                "name": "Brócolis cozidos",
                "quantity": 100,
                "unit": "g",
                "alt_items": [
                  { "name": "Couve-flor", "quantity": 100, "unit": "g" },
                  { "name": "Abobrinha", "quantity": 120, "unit": "g" }
                ]
              },
              {
                "name": "Azeite de oliva",
                "quantity": 10,
                "unit": "ml",
                "alt_items": [
                  { "name": "Azeite de abacate", "quantity": 10, "unit": "ml" },
                  { "name": "Sementes de linhaça", "quantity": 10, "unit": "g" }
                ]
              }
            ],
            "calories": 400
          },
          {
            "name": "Lanche da tarde",
            "items": [
              {
                "name": "Nozes",
                "quantity": 20,
                "unit": "g",
                "alt_items": [
                  { "name": "Amêndoas", "quantity": 20, "unit": "g" },
                  { "name": "Castanha-do-pará", "quantity": 15, "unit": "g" }
                ]
              },
              {
                "name": "Pera",
                "quantity": 1,
                "unit": "unidade",
                "alt_items": [
                  { "name": "Maçã", "quantity": 1, "unit": "unidade" },
                  { "name": "Laranja", "quantity": 1, "unit": "unidade" }
                ]
              }
            ],
            "calories": 200
          },
          {
            "name": "Jantar",
            "items": [
              {
                "name": "Peixe grelhado",
                "quantity": 120,
                "unit": "g",
                "alt_items": [
                  { "name": "Frango grelhado", "quantity": 120, "unit": "g" },
                  { "name": "Ovos cozidos", "quantity": 2, "unit": "unidades" }
                ]
              },
              {
                "name": "Salada de folhas (alface, rúcula, tomate)",
                "quantity": 150,
                "unit": "g",
                "alt_items": [
                  { "name": "Espinafre cru", "quantity": 150, "unit": "g" },
                  { "name": "Couve", "quantity": 120, "unit": "g" }
                ]
              },
              {
                "name": "Batata-doce assada",
                "quantity": 80,
                "unit": "g",
                "alt_items": [
                  { "name": "Abóbora assada", "quantity": 80, "unit": "g" },
                  { "name": "Inhame cozido", "quantity": 80, "unit": "g" }
                ]
              }
            ],
            "calories": 300
          }
        ]
      }
    ]
  }'
);



INSERT INTO diets 
(slug, title, description, tags, category, difficulty, duration_weeks, popularity_score, is_public, created_at, updated_at, calories_total, macros, week_plan)
VALUES
(
  'cetogenica-2400',
  'Dieta Cetogênica (2400 kcal)',
  'Plano alimentar com baixo consumo de carboidratos, proteínas moderadas e alto consumo de gorduras boas. Versão ajustada para 2400 kcal por dia.',
  '{"cetogenica","low_carb","manutencao"}',
  'low_carb',
  'avancado',
  6,
  16,
  TRUE,
  NOW(),
  NOW(),
  2400,
  '{
    "proteina": 150,
    "carboidrato": 60,
    "gordura": 180
  }',
  '{
    "days": [
      {
        "day_index": 0,
        "meals": [
          {
            "name": "Café da manhã",
            "items": [
              {
                "name": "Ovos mexidos",
                "quantity": 4,
                "unit": "unidades",
                "alt_items": [
                  { "name": "Omelete de queijo", "quantity": 4, "unit": "ovos" },
                  { "name": "Ovos cozidos", "quantity": 4, "unit": "unidades" }
                ]
              },
              {
                "name": "Abacate",
                "quantity": 150,
                "unit": "g",
                "alt_items": [
                  { "name": "Azeite de oliva", "quantity": 30, "unit": "ml" },
                  { "name": "Castanhas de caju", "quantity": 30, "unit": "g" }
                ]
              }
            ],
            "calories": 600
          },
          {
            "name": "Almoço",
            "items": [
              {
                "name": "Peixe grelhado",
                "quantity": 180,
                "unit": "g",
                "alt_items": [
                  { "name": "Frango grelhado", "quantity": 180, "unit": "g" },
                  { "name": "Carne bovina magra", "quantity": 170, "unit": "g" }
                ]
              },
              {
                "name": "Brócolis cozidos",
                "quantity": 150,
                "unit": "g",
                "alt_items": [
                  { "name": "Couve-flor", "quantity": 150, "unit": "g" },
                  { "name": "Abobrinha", "quantity": 150, "unit": "g" }
                ]
              },
              {
                "name": "Azeite de oliva",
                "quantity": 30,
                "unit": "ml",
                "alt_items": [
                  { "name": "Manteiga", "quantity": 25, "unit": "g" },
                  { "name": "Óleo de coco", "quantity": 25, "unit": "g" }
                ]
              }
            ],
            "calories": 800
          },
          {
            "name": "Lanche da tarde",
            "items": [
              {
                "name": "Queijo muçarela",
                "quantity": 80,
                "unit": "g",
                "alt_items": [
                  { "name": "Queijo prato", "quantity": 80, "unit": "g" },
                  { "name": "Queijo minas", "quantity": 80, "unit": "g" }
                ]
              },
              {
                "name": "Amêndoas",
                "quantity": 40,
                "unit": "g",
                "alt_items": [
                  { "name": "Castanha-do-pará", "quantity": 35, "unit": "g" },
                  { "name": "Nozes", "quantity": 40, "unit": "g" }
                ]
              }
            ],
            "calories": 400
          },
          {
            "name": "Jantar",
            "items": [
              {
                "name": "Carne bovina magra",
                "quantity": 180,
                "unit": "g",
                "alt_items": [
                  { "name": "Frango grelhado", "quantity": 180, "unit": "g" },
                  { "name": "Peixe grelhado", "quantity": 180, "unit": "g" }
                ]
              },
              {
                "name": "Couve refogada",
                "quantity": 150,
                "unit": "g",
                "alt_items": [
                  { "name": "Espinafre refogado", "quantity": 150, "unit": "g" },
                  { "name": "Acelga", "quantity": 150, "unit": "g" }
                ]
              },
              {
                "name": "Azeite de oliva",
                "quantity": 30,
                "unit": "ml",
                "alt_items": [
                  { "name": "Manteiga", "quantity": 25, "unit": "g" },
                  { "name": "Óleo de coco", "quantity": 25, "unit": "g" }
                ]
              }
            ],
            "calories": 600
          }
        ]
      }
    ]
  }'
);



INSERT INTO diets 
(slug, title, description, tags, category, difficulty, duration_weeks, popularity_score, is_public, created_at, updated_at, calories_total, macros, week_plan)
VALUES
(
  'cetogenica-2000',
  'Dieta Cetogênica (2000 kcal)',
  'Plano alimentar com baixo consumo de carboidratos, proteínas moderadas e alto consumo de gorduras boas. Versão ajustada para 2000 kcal por dia.',
  '{"cetogenica","low_carb","perda_de_peso"}',
  'low_carb',
  'intermediario',
  6,
  15,
  TRUE,
  NOW(),
  NOW(),
  2000,
  '{
    "proteina": 130,
    "carboidrato": 50,
    "gordura": 150
  }',
  '{
    "days": [
      {
        "day_index": 0,
        "meals": [
          {
            "name": "Café da manhã",
            "items": [
              {
                "name": "Ovos mexidos",
                "quantity": 3,
                "unit": "unidades",
                "alt_items": [
                  { "name": "Omelete de queijo", "quantity": 3, "unit": "ovos" },
                  { "name": "Ovos cozidos", "quantity": 3, "unit": "unidades" }
                ]
              },
              {
                "name": "Abacate",
                "quantity": 100,
                "unit": "g",
                "alt_items": [
                  { "name": "Azeite de oliva", "quantity": 20, "unit": "ml" },
                  { "name": "Castanhas de caju", "quantity": 25, "unit": "g" }
                ]
              }
            ],
            "calories": 500
          },
          {
            "name": "Almoço",
            "items": [
              {
                "name": "Peixe grelhado",
                "quantity": 160,
                "unit": "g",
                "alt_items": [
                  { "name": "Frango grelhado", "quantity": 160, "unit": "g" },
                  { "name": "Carne bovina magra", "quantity": 150, "unit": "g" }
                ]
              },
              {
                "name": "Brócolis cozidos",
                "quantity": 120,
                "unit": "g",
                "alt_items": [
                  { "name": "Couve-flor", "quantity": 120, "unit": "g" },
                  { "name": "Abobrinha", "quantity": 120, "unit": "g" }
                ]
              },
              {
                "name": "Azeite de oliva",
                "quantity": 25,
                "unit": "ml",
                "alt_items": [
                  { "name": "Manteiga", "quantity": 20, "unit": "g" },
                  { "name": "Óleo de coco", "quantity": 20, "unit": "g" }
                ]
              }
            ],
            "calories": 700
          },
          {
            "name": "Lanche da tarde",
            "items": [
              {
                "name": "Queijo muçarela",
                "quantity": 60,
                "unit": "g",
                "alt_items": [
                  { "name": "Queijo prato", "quantity": 60, "unit": "g" },
                  { "name": "Queijo minas", "quantity": 60, "unit": "g" }
                ]
              },
              {
                "name": "Amêndoas",
                "quantity": 30,
                "unit": "g",
                "alt_items": [
                  { "name": "Castanha-do-pará", "quantity": 25, "unit": "g" },
                  { "name": "Nozes", "quantity": 30, "unit": "g" }
                ]
              }
            ],
            "calories": 350
          },
          {
            "name": "Jantar",
            "items": [
              {
                "name": "Carne bovina magra",
                "quantity": 160,
                "unit": "g",
                "alt_items": [
                  { "name": "Frango grelhado", "quantity": 160, "unit": "g" },
                  { "name": "Peixe grelhado", "quantity": 160, "unit": "g" }
                ]
              },
              {
                "name": "Couve refogada",
                "quantity": 120,
                "unit": "g",
                "alt_items": [
                  { "name": "Espinafre refogado", "quantity": 120, "unit": "g" },
                  { "name": "Acelga", "quantity": 120, "unit": "g" }
                ]
              },
              {
                "name": "Azeite de oliva",
                "quantity": 25,
                "unit": "ml",
                "alt_items": [
                  { "name": "Manteiga", "quantity": 20, "unit": "g" },
                  { "name": "Óleo de coco", "quantity": 20, "unit": "g" }
                ]
              }
            ],
            "calories": 450
          }
        ]
      }
    ]
  }'
);



INSERT INTO diets 
(slug, title, description, tags, category, difficulty, duration_weeks, popularity_score, is_public, created_at, updated_at, calories_total, macros, week_plan)
VALUES
(
  'cetogenica-1600',
  'Dieta Cetogênica (1600 kcal)',
  'Plano alimentar com baixo consumo de carboidratos, proteínas moderadas e alto consumo de gorduras boas. Versão ajustada para 1600 kcal por dia.',
  '{"cetogenica","low_carb","perda_de_peso"}',
  'low_carb',
  'intermediario',
  6,
  12,
  TRUE,
  NOW(),
  NOW(),
  1600,
  '{
    "proteina": 100,
    "carboidrato": 40,
    "gordura": 120
  }',
  '{
    "days": [
      {
        "day_index": 0,
        "meals": [
          {
            "name": "Café da manhã",
            "items": [
              {
                "name": "Ovos mexidos",
                "quantity": 3,
                "unit": "unidades",
                "alt_items": [
                  { "name": "Omelete de queijo", "quantity": 3, "unit": "ovos" },
                  { "name": "Ovos cozidos", "quantity": 3, "unit": "unidades" }
                ]
              },
              {
                "name": "Abacate",
                "quantity": 70,
                "unit": "g",
                "alt_items": [
                  { "name": "Azeite de oliva", "quantity": 15, "unit": "ml" },
                  { "name": "Castanhas de caju", "quantity": 20, "unit": "g" }
                ]
              }
            ],
            "calories": 400
          },
          {
            "name": "Almoço",
            "items": [
              {
                "name": "Peixe grelhado",
                "quantity": 130,
                "unit": "g",
                "alt_items": [
                  { "name": "Frango grelhado", "quantity": 130, "unit": "g" },
                  { "name": "Carne bovina magra", "quantity": 120, "unit": "g" }
                ]
              },
              {
                "name": "Brócolis cozidos",
                "quantity": 100,
                "unit": "g",
                "alt_items": [
                  { "name": "Couve-flor", "quantity": 100, "unit": "g" },
                  { "name": "Abobrinha", "quantity": 100, "unit": "g" }
                ]
              },
              {
                "name": "Azeite de oliva",
                "quantity": 20,
                "unit": "ml",
                "alt_items": [
                  { "name": "Manteiga", "quantity": 15, "unit": "g" },
                  { "name": "Óleo de coco", "quantity": 15, "unit": "g" }
                ]
              }
            ],
            "calories": 550
          },
          {
            "name": "Lanche da tarde",
            "items": [
              {
                "name": "Queijo muçarela",
                "quantity": 50,
                "unit": "g",
                "alt_items": [
                  { "name": "Queijo prato", "quantity": 50, "unit": "g" },
                  { "name": "Queijo minas", "quantity": 50, "unit": "g" }
                ]
              },
              {
                "name": "Amêndoas",
                "quantity": 25,
                "unit": "g",
                "alt_items": [
                  { "name": "Castanha-do-pará", "quantity": 20, "unit": "g" },
                  { "name": "Nozes", "quantity": 25, "unit": "g" }
                ]
              }
            ],
            "calories": 300
          },
          {
            "name": "Jantar",
            "items": [
              {
                "name": "Carne bovina magra",
                "quantity": 130,
                "unit": "g",
                "alt_items": [
                  { "name": "Frango grelhado", "quantity": 130, "unit": "g" },
                  { "name": "Peixe grelhado", "quantity": 130, "unit": "g" }
                ]
              },
              {
                "name": "Couve refogada",
                "quantity": 100,
                "unit": "g",
                "alt_items": [
                  { "name": "Espinafre refogado", "quantity": 100, "unit": "g" },
                  { "name": "Acelga", "quantity": 100, "unit": "g" }
                ]
              },
              {
                "name": "Azeite de oliva",
                "quantity": 20,
                "unit": "ml",
                "alt_items": [
                  { "name": "Manteiga", "quantity": 15, "unit": "g" },
                  { "name": "Óleo de coco", "quantity": 15, "unit": "g" }
                ]
              }
            ],
            "calories": 350
          }
        ]
      }
    ]
  }'
);



INSERT INTO diets 
(slug, title, description, tags, category, difficulty, duration_weeks, popularity_score, is_public, created_at, updated_at, calories_total, macros, week_plan)
VALUES
(
  'cetogenica-1200',
  'Dieta Cetogênica (1200 kcal)',
  'Plano alimentar com baixo consumo de carboidratos, proteínas moderadas e alto consumo de gorduras boas. Versão ajustada para 1200 kcal por dia.',
  '{"cetogenica","low_carb","perda_de_peso"}',
  'low_carb',
  'intermediario',
  6,
  10,
  TRUE,
  NOW(),
  NOW(),
  1200,
  '{
    "proteina": 75,
    "carboidrato": 30,
    "gordura": 90
  }',
  '{
    "days": [
      {
        "day_index": 0,
        "meals": [
          {
            "name": "Café da manhã",
            "items": [
              {
                "name": "Ovos mexidos",
                "quantity": 2,
                "unit": "unidades",
                "alt_items": [
                  { "name": "Omelete de queijo", "quantity": 2, "unit": "ovos" },
                  { "name": "Ovos cozidos", "quantity": 2, "unit": "unidades" }
                ]
              },
              {
                "name": "Abacate",
                "quantity": 50,
                "unit": "g",
                "alt_items": [
                  { "name": "Azeite de oliva", "quantity": 10, "unit": "ml" },
                  { "name": "Castanhas de caju", "quantity": 15, "unit": "g" }
                ]
              }
            ],
            "calories": 300
          },
          {
            "name": "Almoço",
            "items": [
              {
                "name": "Peixe grelhado",
                "quantity": 100,
                "unit": "g",
                "alt_items": [
                  { "name": "Frango grelhado", "quantity": 100, "unit": "g" },
                  { "name": "Carne bovina magra", "quantity": 90, "unit": "g" }
                ]
              },
              {
                "name": "Brócolis cozidos",
                "quantity": 80,
                "unit": "g",
                "alt_items": [
                  { "name": "Couve-flor", "quantity": 80, "unit": "g" },
                  { "name": "Abobrinha", "quantity": 80, "unit": "g" }
                ]
              },
              {
                "name": "Azeite de oliva",
                "quantity": 15,
                "unit": "ml",
                "alt_items": [
                  { "name": "Manteiga", "quantity": 10, "unit": "g" },
                  { "name": "Óleo de coco", "quantity": 10, "unit": "g" }
                ]
              }
            ],
            "calories": 400
          },
          {
            "name": "Lanche da tarde",
            "items": [
              {
                "name": "Queijo muçarela",
                "quantity": 40,
                "unit": "g",
                "alt_items": [
                  { "name": "Queijo prato", "quantity": 40, "unit": "g" },
                  { "name": "Queijo minas", "quantity": 40, "unit": "g" }
                ]
              },
              {
                "name": "Amêndoas",
                "quantity": 20,
                "unit": "g",
                "alt_items": [
                  { "name": "Castanha-do-pará", "quantity": 15, "unit": "g" },
                  { "name": "Nozes", "quantity": 20, "unit": "g" }
                ]
              }
            ],
            "calories": 250
          },
          {
            "name": "Jantar",
            "items": [
              {
                "name": "Carne bovina magra",
                "quantity": 100,
                "unit": "g",
                "alt_items": [
                  { "name": "Frango grelhado", "quantity": 100, "unit": "g" },
                  { "name": "Peixe grelhado", "quantity": 100, "unit": "g" }
                ]
              },
              {
                "name": "Couve refogada",
                "quantity": 80,
                "unit": "g",
                "alt_items": [
                  { "name": "Espinafre refogado", "quantity": 80, "unit": "g" },
                  { "name": "Acelga", "quantity": 80, "unit": "g" }
                ]
              },
              {
                "name": "Azeite de oliva",
                "quantity": 15,
                "unit": "ml",
                "alt_items": [
                  { "name": "Manteiga", "quantity": 10, "unit": "g" },
                  { "name": "Óleo de coco", "quantity": 10, "unit": "g" }
                ]
              }
            ],
            "calories": 250
          }
        ]
      }
    ]
  }'
);


INSERT INTO diets 
(slug, title, description, tags, category, difficulty, duration_weeks, popularity_score, is_public, created_at, updated_at, calories_total, macros, week_plan)
VALUES
(
  'tradicional-2400',
  'Dieta Tradicional (2400 kcal)',
  'Alimentação baseada na culinária brasileira comum, incluindo arroz, feijão, carnes magras, legumes e frutas. Versão ajustada para 2400 kcal por dia.',
  '{"tradicional","perda_de_peso","equilibrada"}',
  'tradicional',
  'iniciante',
  4,
  18,
  TRUE,
  NOW(),
  NOW(),
  2400,
  '{
    "proteina": 180,
    "carboidrato": 280,
    "gordura": 85
  }',
  '{
    "days": [
      {
        "day_index": 0,
        "meals": [
          {
            "name": "Café da manhã",
            "items": [
              {
                "name": "Pão integral",
                "quantity": 3,
                "unit": "fatias",
                "alt_items": [
                  { "name": "Tapioca", "quantity": 100, "unit": "g" },
                  { "name": "Aveia", "quantity": 60, "unit": "g" }
                ]
              },
              {
                "name": "Queijo branco",
                "quantity": 80,
                "unit": "g",
                "alt_items": [
                  { "name": "Ovos mexidos", "quantity": 3, "unit": "unidades" },
                  { "name": "Iogurte natural", "quantity": 200, "unit": "ml" }
                ]
              }
            ],
            "calories": 550
          },
          {
            "name": "Almoço",
            "items": [
              {
                "name": "Arroz integral",
                "quantity": 160,
                "unit": "g",
                "alt_items": [
                  { "name": "Batata-doce", "quantity": 200, "unit": "g" },
                  { "name": "Lentilha", "quantity": 140, "unit": "g" }
                ]
              },
              {
                "name": "Feijão",
                "quantity": 120,
                "unit": "g",
                "alt_items": [
                  { "name": "Grão-de-bico", "quantity": 120, "unit": "g" },
                  { "name": "Ervilha", "quantity": 120, "unit": "g" }
                ]
              },
              {
                "name": "Frango grelhado",
                "quantity": 200,
                "unit": "g",
                "alt_items": [
                  { "name": "Peixe grelhado", "quantity": 200, "unit": "g" },
                  { "name": "Carne magra", "quantity": 180, "unit": "g" }
                ]
              },
              {
                "name": "Brócolis cozidos",
                "quantity": 150,
                "unit": "g",
                "alt_items": [
                  { "name": "Couve-flor", "quantity": 150, "unit": "g" },
                  { "name": "Abobrinha", "quantity": 150, "unit": "g" }
                ]
              }
            ],
            "calories": 950
          },
          {
            "name": "Lanche da tarde",
            "items": [
              {
                "name": "Maçã",
                "quantity": 1,
                "unit": "unidade",
                "alt_items": [
                  { "name": "Banana", "quantity": 1, "unit": "unidade" },
                  { "name": "Laranja", "quantity": 1, "unit": "unidade" }
                ]
              },
              {
                "name": "Castanhas de caju",
                "quantity": 30,
                "unit": "g",
                "alt_items": [
                  { "name": "Amêndoas", "quantity": 30, "unit": "g" },
                  { "name": "Nozes", "quantity": 30, "unit": "g" }
                ]
              }
            ],
            "calories": 350
          },
          {
            "name": "Jantar",
            "items": [
              {
                "name": "Sopa de legumes",
                "quantity": 600,
                "unit": "ml",
                "alt_items": [
                  { "name": "Purê de abóbora", "quantity": 350, "unit": "g" },
                  { "name": "Sopa de lentilha", "quantity": 400, "unit": "ml" }
                ]
              },
              {
                "name": "Ovos cozidos",
                "quantity": 3,
                "unit": "unidades",
                "alt_items": [
                  { "name": "Omelete", "quantity": 3, "unit": "ovos" },
                  { "name": "Tofu grelhado", "quantity": 200, "unit": "g" }
                ]
              }
            ],
            "calories": 550
          }
        ]
      }
    ]
  }'
);




INSERT INTO diets 
(slug, title, description, tags, category, difficulty, duration_weeks, popularity_score, is_public, created_at, updated_at, calories_total, macros, week_plan)
VALUES
(
  'tradicional-2000',
  'Dieta Tradicional (2000 kcal)',
  'Alimentação baseada na culinária brasileira comum, incluindo arroz, feijão, carnes magras, legumes e frutas. Versão ajustada para 2000 kcal por dia.',
  '{"tradicional","perda_de_peso","equilibrada"}',
  'tradicional',
  'iniciante',
  4,
  15,
  TRUE,
  NOW(),
  NOW(),
  2000,
  '{
    "proteina": 150,
    "carboidrato": 220,
    "gordura": 70
  }',
  '{
    "days": [
      {
        "day_index": 0,
        "meals": [
          {
            "name": "Café da manhã",
            "items": [
              {
                "name": "Pão integral",
                "quantity": 2,
                "unit": "fatias",
                "alt_items": [
                  { "name": "Tapioca", "quantity": 80, "unit": "g" },
                  { "name": "Aveia", "quantity": 50, "unit": "g" }
                ]
              },
              {
                "name": "Queijo branco",
                "quantity": 60,
                "unit": "g",
                "alt_items": [
                  { "name": "Ovos mexidos", "quantity": 2, "unit": "unidades" },
                  { "name": "Iogurte natural", "quantity": 150, "unit": "ml" }
                ]
              }
            ],
            "calories": 450
          },
          {
            "name": "Almoço",
            "items": [
              {
                "name": "Arroz integral",
                "quantity": 130,
                "unit": "g",
                "alt_items": [
                  { "name": "Batata-doce", "quantity": 160, "unit": "g" },
                  { "name": "Lentilha", "quantity": 110, "unit": "g" }
                ]
              },
              {
                "name": "Feijão",
                "quantity": 100,
                "unit": "g",
                "alt_items": [
                  { "name": "Grão-de-bico", "quantity": 100, "unit": "g" },
                  { "name": "Ervilha", "quantity": 100, "unit": "g" }
                ]
              },
              {
                "name": "Frango grelhado",
                "quantity": 160,
                "unit": "g",
                "alt_items": [
                  { "name": "Peixe grelhado", "quantity": 160, "unit": "g" },
                  { "name": "Carne magra", "quantity": 150, "unit": "g" }
                ]
              },
              {
                "name": "Brócolis cozidos",
                "quantity": 120,
                "unit": "g",
                "alt_items": [
                  { "name": "Couve-flor", "quantity": 120, "unit": "g" },
                  { "name": "Abobrinha", "quantity": 120, "unit": "g" }
                ]
              }
            ],
            "calories": 750
          },
          {
            "name": "Lanche da tarde",
            "items": [
              {
                "name": "Maçã",
                "quantity": 1,
                "unit": "unidade",
                "alt_items": [
                  { "name": "Banana", "quantity": 1, "unit": "unidade" },
                  { "name": "Laranja", "quantity": 1, "unit": "unidade" }
                ]
              },
              {
                "name": "Castanhas de caju",
                "quantity": 25,
                "unit": "g",
                "alt_items": [
                  { "name": "Amêndoas", "quantity": 25, "unit": "g" },
                  { "name": "Nozes", "quantity": 25, "unit": "g" }
                ]
              }
            ],
            "calories": 300
          },
          {
            "name": "Jantar",
            "items": [
              {
                "name": "Sopa de legumes",
                "quantity": 500,
                "unit": "ml",
                "alt_items": [
                  { "name": "Purê de abóbora", "quantity": 300, "unit": "g" },
                  { "name": "Sopa de lentilha", "quantity": 350, "unit": "ml" }
                ]
              },
              {
                "name": "Ovos cozidos",
                "quantity": 3,
                "unit": "unidades",
                "alt_items": [
                  { "name": "Omelete", "quantity": 3, "unit": "ovos" },
                  { "name": "Tofu grelhado", "quantity": 150, "unit": "g" }
                ]
              }
            ],
            "calories": 500
          }
        ]
      }
    ]
  }'
);


INSERT INTO diets 
(slug, title, description, tags, category, difficulty, duration_weeks, popularity_score, is_public, created_at, updated_at, calories_total, macros, week_plan)
VALUES
(
  'tradicional-1600',
  'Dieta Tradicional (1600 kcal)',
  'Alimentação baseada na culinária brasileira comum, incluindo arroz, feijão, carnes magras, legumes e frutas. Versão ajustada para 1600 kcal por dia.',
  '{"tradicional","perda_de_peso","equilibrada"}',
  'tradicional',
  'iniciante',
  4,
  12,
  TRUE,
  NOW(),
  NOW(),
  1600,
  '{
    "proteina": 120,
    "carboidrato": 160,
    "gordura": 55
  }',
  '{
    "days": [
      {
        "day_index": 0,
        "meals": [
          {
            "name": "Café da manhã",
            "items": [
              {
                "name": "Pão integral",
                "quantity": 2,
                "unit": "fatias",
                "alt_items": [
                  { "name": "Tapioca", "quantity": 60, "unit": "g" },
                  { "name": "Aveia", "quantity": 40, "unit": "g" }
                ]
              },
              {
                "name": "Queijo branco",
                "quantity": 40,
                "unit": "g",
                "alt_items": [
                  { "name": "Ovos mexidos", "quantity": 2, "unit": "unidades" },
                  { "name": "Iogurte natural", "quantity": 120, "unit": "ml" }
                ]
              }
            ],
            "calories": 400
          },
          {
            "name": "Almoço",
            "items": [
              {
                "name": "Arroz integral",
                "quantity": 100,
                "unit": "g",
                "alt_items": [
                  { "name": "Batata-doce", "quantity": 130, "unit": "g" },
                  { "name": "Lentilha", "quantity": 90, "unit": "g" }
                ]
              },
              {
                "name": "Feijão",
                "quantity": 90,
                "unit": "g",
                "alt_items": [
                  { "name": "Grão-de-bico", "quantity": 90, "unit": "g" },
                  { "name": "Ervilha", "quantity": 90, "unit": "g" }
                ]
              },
              {
                "name": "Frango grelhado",
                "quantity": 140,
                "unit": "g",
                "alt_items": [
                  { "name": "Peixe grelhado", "quantity": 140, "unit": "g" },
                  { "name": "Carne magra", "quantity": 120, "unit": "g" }
                ]
              },
              {
                "name": "Brócolis cozidos",
                "quantity": 100,
                "unit": "g",
                "alt_items": [
                  { "name": "Couve-flor", "quantity": 100, "unit": "g" },
                  { "name": "Abobrinha", "quantity": 100, "unit": "g" }
                ]
              }
            ],
            "calories": 650
          },
          {
            "name": "Lanche da tarde",
            "items": [
              {
                "name": "Maçã",
                "quantity": 1,
                "unit": "unidade",
                "alt_items": [
                  { "name": "Banana", "quantity": 1, "unit": "unidade" },
                  { "name": "Laranja", "quantity": 1, "unit": "unidade" }
                ]
              },
              {
                "name": "Castanhas de caju",
                "quantity": 20,
                "unit": "g",
                "alt_items": [
                  { "name": "Amêndoas", "quantity": 20, "unit": "g" },
                  { "name": "Nozes", "quantity": 20, "unit": "g" }
                ]
              }
            ],
            "calories": 250
          },
          {
            "name": "Jantar",
            "items": [
              {
                "name": "Sopa de legumes",
                "quantity": 400,
                "unit": "ml",
                "alt_items": [
                  { "name": "Purê de abóbora", "quantity": 250, "unit": "g" },
                  { "name": "Sopa de lentilha", "quantity": 300, "unit": "ml" }
                ]
              },
              {
                "name": "Ovos cozidos",
                "quantity": 2,
                "unit": "unidades",
                "alt_items": [
                  { "name": "Omelete", "quantity": 2, "unit": "ovos" },
                  { "name": "Tofu grelhado", "quantity": 120, "unit": "g" }
                ]
              }
            ],
            "calories": 350
          }
        ]
      }
    ]
  }'
);


INSERT INTO diets 
(slug, title, description, tags, category, difficulty, duration_weeks, popularity_score, is_public, created_at, updated_at, calories_total, macros, week_plan)
VALUES
(
  'tradicional-1200',
  'Dieta Tradicional (1200 kcal)',
  'Alimentação baseada na culinária brasileira comum, incluindo arroz, feijão, carnes magras, legumes e frutas. Versão ajustada para 1200 kcal por dia.',
  '{"tradicional","perda_de_peso","equilibrada"}',
  'tradicional',
  'iniciante',
  4,
  10,
  TRUE,
  NOW(),
  NOW(),
  1200,
  '{
    "proteina": 90,
    "carboidrato": 120,
    "gordura": 40
  }',
  '{
    "days": [
      {
        "day_index": 0,
        "meals": [
          {
            "name": "Café da manhã",
            "items": [
              {
                "name": "Pão integral",
                "quantity": 1,
                "unit": "fatia",
                "alt_items": [
                  { "name": "Tapioca", "quantity": 40, "unit": "g" },
                  { "name": "Aveia", "quantity": 30, "unit": "g" }
                ]
              },
              {
                "name": "Queijo branco",
                "quantity": 30,
                "unit": "g",
                "alt_items": [
                  { "name": "Ovos mexidos", "quantity": 1, "unit": "unidade" },
                  { "name": "Iogurte natural", "quantity": 80, "unit": "ml" }
                ]
              }
            ],
            "calories": 300
          },
          {
            "name": "Almoço",
            "items": [
              {
                "name": "Arroz integral",
                "quantity": 80,
                "unit": "g",
                "alt_items": [
                  { "name": "Batata-doce", "quantity": 100, "unit": "g" },
                  { "name": "Lentilha", "quantity": 70, "unit": "g" }
                ]
              },
              {
                "name": "Feijão",
                "quantity": 70,
                "unit": "g",
                "alt_items": [
                  { "name": "Grão-de-bico", "quantity": 70, "unit": "g" },
                  { "name": "Ervilha", "quantity": 70, "unit": "g" }
                ]
              },
              {
                "name": "Frango grelhado",
                "quantity": 100,
                "unit": "g",
                "alt_items": [
                  { "name": "Peixe grelhado", "quantity": 100, "unit": "g" },
                  { "name": "Carne magra", "quantity": 90, "unit": "g" }
                ]
              },
              {
                "name": "Brócolis cozidos",
                "quantity": 80,
                "unit": "g",
                "alt_items": [
                  { "name": "Couve-flor", "quantity": 80, "unit": "g" },
                  { "name": "Abobrinha", "quantity": 80, "unit": "g" }
                ]
              }
            ],
            "calories": 500
          },
          {
            "name": "Lanche da tarde",
            "items": [
              {
                "name": "Maçã",
                "quantity": 1,
                "unit": "unidade",
                "alt_items": [
                  { "name": "Banana", "quantity": 1, "unit": "unidade" },
                  { "name": "Laranja", "quantity": 1, "unit": "unidade" }
                ]
              },
              {
                "name": "Castanhas de caju",
                "quantity": 15,
                "unit": "g",
                "alt_items": [
                  { "name": "Amêndoas", "quantity": 15, "unit": "g" },
                  { "name": "Nozes", "quantity": 15, "unit": "g" }
                ]
              }
            ],
            "calories": 200
          },
          {
            "name": "Jantar",
            "items": [
              {
                "name": "Sopa de legumes",
                "quantity": 300,
                "unit": "ml",
                "alt_items": [
                  { "name": "Purê de abóbora", "quantity": 200, "unit": "g" },
                  { "name": "Sopa de lentilha", "quantity": 250, "unit": "ml" }
                ]
              },
              {
                "name": "Ovos cozidos",
                "quantity": 2,
                "unit": "unidades",
                "alt_items": [
                  { "name": "Omelete", "quantity": 2, "unit": "ovos" },
                  { "name": "Tofu grelhado", "quantity": 100, "unit": "g" }
                ]
              }
            ],
            "calories": 200
          }
        ]
      }
    ]
  }'
);
