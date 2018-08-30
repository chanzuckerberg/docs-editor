# namespace: docs_editor_0_0_5_7
# version: 0.0.5
# name: docs-editor
# subversion: 7

# http://cdn.summitlearning.org/assets/index_latest.html
aws s3 cp bin/index_latest.html s3://opt-static-resources/assets/index_latest.html --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers;

# http://cdn.summitlearning.org/assets/index_docs_editor_0_0_5_7.html
aws s3 cp bin/index_docs_editor_0_0_5_7.html s3://opt-static-resources/assets/index_docs_editor_0_0_5_7.html --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers;
