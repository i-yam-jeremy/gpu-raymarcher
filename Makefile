SRC_DIR = src
CLIENT_SOURCES := $(shell find $(SRC_DIR) -name "*.ts")
OUTPUT_JS_FILE = $(SRC_DIR)/client.js

all: $(OUTPUT_JS_FILE) $(SERVER_JS_FILE)

client: $(OUTPUT_JS_FILE)
$(OUTPUT_JS_FILE): $(CLIENT_SOURCES) $(PPC_OUTPUT_MARKER_FILE)
	tsc -p $(SRC_DIR)
	browserify $(SRC_DIR)/main.js > $(OUTPUT_JS_FILE)
	find $(SRC_DIR) -name "*.js" -type f | grep -Ev '^($(OUTPUT_JS_FILE))' | xargs rm

clean:
	rm $(OUTPUT_JS_FILE)
