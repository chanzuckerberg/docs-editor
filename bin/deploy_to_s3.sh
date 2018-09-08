# namespace: docs_editor_0_0_6_2
# version: 0.0.6
# name: docs-editor
# subversion: 2

# http://cdn.summitlearning.org/assets/index_latest.html
aws s3 cp bin/index_latest.html s3://opt-static-resources/assets/index_latest.html --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers;

# http://cdn.summitlearning.org/assets/index_docs_editor_0_0_6_2.html
aws s3 cp bin/index_docs_editor_0_0_6_2.html s3://opt-static-resources/assets/index_docs_editor_0_0_6_2.html --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers;
