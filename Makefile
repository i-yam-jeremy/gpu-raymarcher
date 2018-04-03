CLIENT_DIR = client
CLIENT_SOURCES := $(shell find $(CLIENT_DIR) -name "*.ts")
CLIENT_JS_FILE = $(CLIENT_DIR)/client.js

SERVER_DIR = server
SERVER_SOURCES := $(shell find $(SERVER_DIR) -name "*.ts")
SERVER_JS_FILE = $(SERVER_DIR)/server.js


client: $(CLIENT_SOURCES)
	tsc -p $(CLIENT_DIR)
	browserify $(CLIENT_DIR)/main.js > $(CLIENT_JS_FILE)
	find $(CLIENT_DIR) -name "*.js" -type f | grep -Ev '^($(CLIENT_JS_FILE))' | xargs rm

server: $(SERVER_SOURCES)
	tsc -p $(SERVER_DIR)
	browserify $(SERVER_DIR)/main.js > $(SERVER_JS_FILE)
	find $(SERVER_DIR) -name "*.js" -type f | grep -Ev '^($(SERVER_JS_FILE))' | xargs rm

clean:
	rm $(CLIENT_JS_FILE) $(SERVER_JS_FILE)
