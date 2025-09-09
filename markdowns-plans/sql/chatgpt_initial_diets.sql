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
