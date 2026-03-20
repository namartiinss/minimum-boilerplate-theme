import React, { useState } from 'react'
import styles from './LeadForm.css'

const LeadForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interestCategory: '',
    optIn: false,
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    console.log("entrei")
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Não é obrigatório'
    } else if (formData.firstName.lenght > 50) {
      newErrors.firstName = "Máximo 50 caracteres"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório'
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = 'Máximo 50 caracteres'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "O e-mail é obrigatório"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "E-mail inválido"
    }
    console.log("NEWEErros",newErrors)
    setErrors(newErrors)

  
    return Object.keys(newErrors).length  === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)

    if (!validate()) return

    setLoading(true)
    setApiError('')

    try {
      const response = await fetch('/api/dataentities/LD/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      console.log(response)

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`)
      }

      setSuccess(true)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        interestCategory: '',
        optIn: false,
      })
    } catch (err) {
      console.log(err)
      setApiError('Ocorreu um erro ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={styles.leadFormSuccess}>
        <p>✅ Cadastro realizado com sucesso!</p>
        <button onClick={() => setSuccess(false)}>Novo cadastro</button>
      </div>
    )
  }

  return (
    <div className={styles.leadFormContainer}>
      <h2>Cadastre-se no nosso formulário</h2>
      <form onSubmit={handleSubmit} noValidate>

        <div className={styles.leadFormField}>
          <label>Nome *</label>

          <input
            type="text"
            value={formData.firstName}
            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            maxLength={50}
          />
          {errors.firstName && <span className={styles.leadFormError}>{errors.firstName}</span>}
        </div>

        <div className={styles.leadFormField}>
          <label>Sobrenome</label>

          <input
            type="text"
            value={formData.lastName}
            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            maxLength={50}
          />
          {errors.lastName && <span className={styles.leadFormError}>{errors.lastName}</span>}
        </div>

        <div className={styles.leadFormField}>
          <label>E-mail *</label>

          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            maxLength={50}
          />
          {errors.email && <span className={styles.leadFormError}>{errors.email}</span>}
        </div>
        
        <div className={styles.leadFormField}>
          <label>Categoria de interesse</label>
          <select
          value={formData.interestCategory}
          onChange={e => setFormData({ ...formData, interestCategory: e.target.value })}
          >
            <option value="">Selecione...</option>
            <option value="eletronicos">Eletrônicos</option>
            <option value="moda">Moda</option>
            <option value="casa">Casa e Decoração</option>
            <option value="esportes">Esportes</option>
          </select>
        </div>

        <div className={styles.leadFormField}>
          <label>
            <input className={styles.leadFormCheckbox}
              type="checkbox"
              checked={formData.optIn}
              onChange={e => setFormData({ ...formData, optIn: e.target.checked })}
            />
            Aceito receber comunicações e novidades
          </label>
        </div>

        {apiError && <p className={styles.leadFormError}>{apiError}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  )
}

export default LeadForm