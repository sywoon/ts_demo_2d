@echo off

::�Ҽ� ����Ա����

::Ӳ���� (Hard Link)��ֻ�������ļ���
::mklink /H link_name target_file

::�������� (Symbolic Link)�����������ļ���Ŀ¼��
::����Ŀ¼��mklink /D link_name target_directory
::�����ļ���mklink link_name target_file


::Ӳ���ӣ�Ӳ����Ϊ�ļ��ڴ����ϵ����ݴ�����һ����������� ����Ӳ���Ӷ�����ͬһ������ϵ�����
::    ���ܿ�������ļ�ϵͳ
::    ɾ��Ӳ���Ӳ���Ӱ���ļ������ݣ�����ɾ���˸��ļ������һ��Ӳ����
::    ԭʼ�ļ�����ɾ����Ӳ������Ȼ���Է����ļ�����
::    ����������ͨ�ļ�û������
    
::�������ӣ�����������һ���������͵��ļ� ������һ��ָ����һ���ļ���Ŀ¼��·��
::    ɾ��Դͷ�� ���ӽ�ָ��һ�������ڵ�λ��
::    ��������ָ����ļ���Ŀ¼���ƶ�����������ɾ�����������ӽ�ʧЧ
::    ͨ����ͼ�����������ʶ��
::    �������ӿ��ļ�����֯�ļ�ϵͳ


:: ������\ ����/�ᱨ��
mklink /D %~dp0\dist\res %~dp0\res



pause






































