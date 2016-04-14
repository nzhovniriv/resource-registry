<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "personal_data".
 *
 * @property integer $personal_data_id
 * @property string $last_name
 * @property string $first_name
 * @property string $middle_name
 * @property string $passport_series
 * @property string $passport_number
 * @property string $address
 *
 * @property Resource[] $resources
 * @property User[] $users
 */
class PersonalData extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'personal_data';
    }
    /*
    public function fields(){
    	$fields = parent::fields();
    	unset($fields['personal_data_id']);
    	return $fields;
    }
    */
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['last_name', 'first_name', 'middle_name', 'passport_series', 'passport_number', 'address'], 'required', 'message' => "{attribute} не повинен бути пустим.\n"],
            [['last_name', 'first_name', 'middle_name'], 'string', 'max' => 40],
            [['passport_series'], 'string', 'max' => 5],
            [['passport_number'], 'string', 'max' => 10],
            [['address'], 'string', 'max' => 100],
            [['registrar_key'], 'string', 'max' => 30],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'personal_data_id' => 'Personal Data ID',
            'last_name' => 'Прізвище',
            'first_name' => 'Ім\'я',
            'middle_name' => 'По-батькові',
            'passport_series' => 'Серія паспорта',
            'passport_number' => 'Номер паспорта',
            'address' => 'Адреса',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getResources()
    {
        return $this->hasMany(Resource::className(), ['owner_data_id' => 'personal_data_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUsers()
    {
        return $this->hasMany(User::className(), ['user_data_id' => 'personal_data_id']);
    }
}
