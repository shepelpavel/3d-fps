.PHONY: build
default:
	docker compose up -d --build && \
	docker compose exec nodejs npm install && \
	docker compose down || \
	docker-compose up -d --build && \
	docker-compose exec nodejs npm install && \
	docker-compose down
install:
	docker compose up -d --build && \
	docker compose exec nodejs npm install && \
	docker compose down || \
	docker-compose up -d --build && \
	docker-compose exec nodejs npm install && \
	docker-compose down
dev:
	docker compose up -d --build && \
	docker compose exec nodejs npm run dev || \
	docker-compose up -d --build && \
	docker-compose exec nodejs npm run dev
build:
	docker compose up -d --build && \
	docker compose exec nodejs npm run build && \
	docker compose down || \
	docker-compose up -d --build && \
	docker-compose exec nodejs npm run build && \
	docker-compose down
