CLIENT_DIR = client
CLIENT_SOURCES := $(shell find $(CLIENT_DIR) -name "*.ts")
CLIENT_JS_FILE = $(CLIENT_DIR)/client.js

SERVER_DIR = server
SERVER_SOURCES := $(shell find $(SERVER_DIR) -name "*.ts")
SERVER_JS_FILE = $(SERVER_DIR)/server.js

PPC_DIR = preprocessor
PPC_SOURCES = $(shell find $(PPC_DIR) -name "*.ts")
PPC_OUTPUT_MARKER_FILE = $(PPC_DIR)/output_marker

TEST_DIR = test
TEST_SOURCES := $(shell find $(TEST_DIR) -name "*.ts")
TEST_TMP_DIR = test_tmp
get_source_file_path = $(firstword $(subst test/, ,$1))
make_parent_directories = $(foreach f, $(2),dirname $(1)/$(f) | xargs mkdir -p;)
merge_sources_and_tests = $(foreach f, $(2), cat $(f) $(call get_source_file_path,$(f)) > $(1)/$(f);)

all: $(CLIENT_JS_FILE) $(SERVER_JS_FILE)

client: $(CLIENT_JS_FILE)
$(CLIENT_JS_FILE): $(CLIENT_SOURCES) $(PPC_OUTPUT_MARKER_FILE)
	node $(PPC_DIR)/main.js -pre $(CLIENT_DIR)
	tsc -p $(CLIENT_DIR)
	browserify $(CLIENT_DIR)/main.js > $(CLIENT_JS_FILE)
	find $(CLIENT_DIR) -name "*.js" -type f | grep -Ev '^($(CLIENT_JS_FILE))' | xargs rm
	node $(PPC_DIR)/main.js -post $(CLIENT_DIR)

server: $(SERVER_JS_FILE)
$(SERVER_JS_FILE): $(SERVER_SOURCES) $(PPC_OUTPUT_MARKER_FILE)
	node $(PPC_DIR)/main.js -pre $(SERVER_DIR)
	tsc -p $(SERVER_DIR)
	browserify $(SERVER_DIR)/main.js > $(SERVER_JS_FILE)
	find $(SERVER_DIR) -name "*.js" -type f | grep -Ev '^($(SERVER_JS_FILE))' | xargs rm
	node $(PPC_DIR)/main.js -post $(SERVER_DIR)

$(PPC_OUTPUT_MARKER_FILE): $(PPC_SOURCES) #TODO make it so the target of this is different so it doesn't have to recompile every time, but it also doesn't compile to just one JS file
	tsc -p $(PPC_DIR)
	echo "output marker" > $(PPC_OUTPUT_MARKER_FILE)

test: $(CLIENT_JS_FILE) $(SERVER_JS_FILE) $(TEST_SOURCES)
	$(call make_parent_directories, $(TEST_TMP_DIR),$(TEST_SOURCES))
	$(call merge_sources_and_tests, $(TEST_TMP_DIR), $(TEST_SOURCES))
	tsc -p $(TEST_TMP_DIR)
	find $(TEST_TMP_DIR) -name "*.js" | xargs mocha
	find $(TEST_TMP_DIR) -name "*.js" | xargs rm
	rm -r $(TEST_TMP_DIR)/$(TEST_DIR)

clean:
	find $(PPC_DIR) -name "*.js" | xargs rm
	rm -r $(TEST_TMP_DIR)/$(TEST_DIR)
	rm $(CLIENT_JS_FILE) $(SERVER_JS_FILE)
