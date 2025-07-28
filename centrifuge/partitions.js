var valid = [2, 3, 4, 6];

function getAllPartitions(n) {
    return getPartitions(n, 0, []);
}

function getPartitions(n, m, prefix) {
    var partitions = [];
    for (var i = m; i < valid.length; i++) {
        var newPrefix = prefix.slice();
        newPrefix.push(valid[i]);
        // End of partition
        if (valid[i] == n) {
            var pushPrefix = newPrefix.slice();
            while (pushPrefix.length < 4) {
                pushPrefix.push(0);
            }
            partitions.push(pushPrefix);
        }
        // Still more left, keep going recursively
        else if (valid[i] < n  && newPrefix.length < 4) {
            partitions = partitions.concat(getPartitions(n - valid[i], i, newPrefix));
        }
    }
    return partitions;
}