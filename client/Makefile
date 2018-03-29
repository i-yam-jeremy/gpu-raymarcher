SOURCES := $(shell find ./ -name "*.ts")
OUTPUT_JS_FILE = client.js

$(OUTPUT_JS_FILE): $(SOURCES)
	tsc -p .
	browserify main.js > $(OUTPUT_JS_FILE)
	find . -name "*.js" -type f | grep -Ev '^(./$(OUTPUT_JS_FILE))' | xargs rm

clean:
	rm $(OUTPUT_JS_FILE)
