#!/usr/bin/env bats

setup() {
  export SONAR_TOKEN="dummy_token"
  export SONAR_PROJECT_BASE_DIR="/tmp/project"
  mkdir -p "$SONAR_PROJECT_BASE_DIR"

  # Create a temporary directory for mocks
  MOCK_BIN="$(mktemp -d)"
  export PATH="$MOCK_BIN:$PATH"

  # Create mock sonar-scanner
  cat <<EOF > "$MOCK_BIN/sonar-scanner"
#!/bin/bash
echo "Mock sonar-scanner called with args: \$@"
exit 0
EOF
  chmod +x "$MOCK_BIN/sonar-scanner"
}

teardown() {
  rm -rf "$SONAR_PROJECT_BASE_DIR"
  rm -rf "$MOCK_BIN"
}

@test "Fails if SONAR_TOKEN is not set" {
  unset SONAR_TOKEN
  run ./entrypoint.sh
  [ "$status" -eq 1 ]
  [[ "$output" == *"Set the SONAR_TOKEN env variable."* ]]
}

@test "Fails if Maven project detected" {
  touch "$SONAR_PROJECT_BASE_DIR/pom.xml"
  run ./entrypoint.sh
  [ "$status" -eq 1 ]
  [[ "$output" == *"Maven project detected."* ]]
}

@test "Fails if Gradle project detected" {
  touch "$SONAR_PROJECT_BASE_DIR/build.gradle"
  run ./entrypoint.sh
  [ "$status" -eq 1 ]
  [[ "$output" == *"Gradle project detected."* ]]
}

@test "Succeeds if everything is properly set" {
  run ./entrypoint.sh
  echo "status: $status, output: $output"
  [ "$status" -eq 0 ]
}
