# Clone benchmark
git clone https://github.com/Significant-Gravitas/AutoGPT
mv ./AutoGPT/benchmark ./benchmark
rm -rf AutoGPT

# Extract relevant folders
mv ./benchmark/agbenchmark/challenges ./challenges
mv ./benchmark/reports ./reports
rm -rf ./benchmark

# Prune failed tests
yarn prune-failed-tests

# Extract best times
yarn extract-best-of
