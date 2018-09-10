SRC_DIR = src
CLIENT_SOURCES := $(shell find $(SRC_DIR) -name "*.ts")
OUTPUT_JS_FILE = $(SRC_DIR)/client.js

PPC_DIR = preprocessor
PPC_SOURCES = $(shell find $(PPC_DIR) -name "*.ts")
PPC_OUTPUT_MARKER_FILE = $(PPC_DIR)/output_marker

TEST_DIR = test
TEST_SOURCES := $(shell find $(TEST_DIR) -name "*.ts")
TEST_TMP_DIR = test_tmp
get_source_file_path = $(firstword $(subst test/, ,$1))
make_parent_directories = $(foreach f, $(2),dirname $(1)/$(f) | xargs mkdir -p;)
merge_sources_and_tests = $(foreach f, $(2), cat $(f) $(call get_source_file_path,$(f)) > $(1)/$(f);)

all: $(OUTPUT_JS_FILE) $(SERVER_JS_FILE)

client: $(OUTPUT_JS_FILE)
$(OUTPUT_JS_FILE): $(CLIENT_SOURCES) $(PPC_OUTPUT_MARKER_FILE)
	node $(PPC_DIR)/main.js -pre $(SRC_DIR)
	tsc -p $(SRC_DIR)
	browserify $(SRC_DIR)/main.js > $(OUTPUT_JS_FILE)
	find $(SRC_DIR) -name "*.js" -type f | grep -Ev '^($(OUTPUT_JS_FILE))' | xargs rm
	node $(PPC_DIR)/main.js -post $(SRC_DIR)

$(PPC_OUTPUT_MARKER_FILE): $(PPC_SOURCES) #TODO make it so the target of this is different so it doesn't have to recompile every time, but it also doesn't compile to just one JS file
	tsc -p $(PPC_DIR)
	echo "output marker" > $(PPC_OUTPUT_MARKER_FILE)

test: $(OUTPUT_JS_FILE) $(TEST_SOURCES)
	$(call make_parent_directories, $(TEST_TMP_DIR),$(TEST_SOURCES))
	$(call merge_sources_and_tests, $(TEST_TMP_DIR), $(TEST_SOURCES))
	tsc -p $(TEST_TMP_DIR)
	find $(TEST_TMP_DIR) -name "*.js" | xargs mocha
	find $(TEST_TMP_DIR) -name "*.js" | xargs rm
	rm -r $(TEST_TMP_DIR)/$(TEST_DIR)

clean:
	find $(PPC_DIR) -name "*.js" | xargs rm
	rm -r $(TEST_TMP_DIR)/$(TEST_DIR)
	rm $(OUTPUT_JS_FILE)
