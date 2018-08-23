# namespace: doc_editor_0_0_4_4
# version: 0.0.4
# name: doc-editor
# subversion: 4

# http://cdn.summitlearning.org/assets/index_latest.html
aws s3 cp bin/index_latest.html s3://opt-static-resources/assets/index_latest.html --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers;

# http://cdn.summitlearning.org/assets/index_doc_editor_0_0_4_4.html
aws s3 cp bin/index_doc_editor_0_0_4_4.html s3://opt-static-resources/assets/index_doc_editor_0_0_4_4.html --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers;
