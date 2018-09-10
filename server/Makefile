SOURCE_DIR = src
BUILD_DIR = build

SOURCES := $(shell find $(SOURCE_DIR) -name "*.erl")
COMPILED_BEAMS := $(shell find $(SOURCE_DIR) -name "*.erl" | sed -e 's/\.erl/\.beam/g' | sed -e 's/$(SOURCE_DIR)\//$(BUILD_DIR)\//g')

$(COMPILED_BEAMS): $(SOURCES)
	erlc -o $(BUILD_DIR) $(SOURCES)

build: $(COMPILED_BEAMS)

run: $(COMPILED_BEAMS)
	erl -boot start_clean -pa './$(BUILD_DIR)' -s main start
